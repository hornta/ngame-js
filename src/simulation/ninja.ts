import { getSingleClosestPointSigned } from "../fns";
import type { InputSourceBase } from "src/input-source-base";
import { Ragdoll } from "./ragdoll";
import {
	PlayerDeathType,
	PlayerKillType,
	PlayerKillTypeToDeathType,
	SimulationRate,
	Simulator,
} from "./simulator";
import { Vector2 } from "./vector2.js";
import { CollisionResultLogical } from "./collision-result-logical.js";
import { CollisionResultPhysical } from "./collision-result-physical.js";

enum PlayerState {
	STATE_STANDING = 0,
	STATE_RUNNING = 1,
	STATE_SKIDDING = 2,
	STATE_JUMPING = 3,
	STATE_FALLING = 4,
	STATE_WALLSLIDING = 5,
	STATE_DEAD = 6,
	STATE_AWAITINGDEATH = 7,
	STATE_CELEBRATING = 8,
	STATE_DISABLED = 9,
}

export class Ninja {
	inputSource: InputSourceBase;
	position: Vector2;
	velocity: Vector2;
	oldPosition: Vector2;
	r: number;
	g: number;
	d: number;
	maxSpeedAir: number;
	maxSpeedGround: number;
	groundAccel: number;
	airAccel: number;
	normGrav: number;
	jumpGrav: number;
	normDrag: number;
	winDrag: number;
	wallFriction: number;
	skidFriction: number;
	standFriction: number;
	currentState: PlayerState;
	facingDirection: number;
	maxJumpTime: number;
	jumpTimer: number;
	jumpAmount: number;
	jumpYBias: number;
	terminalVelocity: number;
	wasJumpHeld: boolean;
	oldVelocity: Vector2;
	wasInAir: boolean;
	inAir: boolean;
	nearWall: boolean;
	wallN: Vector2;
	floorN: Vector2;
	fCount: number;
	fVector: Vector2;
	impulseScale: number;
	playerId: number;
	raggy: Ragdoll;
	// ninjaGfx: EntityGraphicsNinja,
	crushThreshold: number;
	crushVector: Vector2;
	crushDistance: number;
	crushFlag: boolean;
	deathType: PlayerDeathType;
	deathPosition: Vector2;
	deathForce: Vector2;
	tmpNearPosition: Vector2;
	resultLogical: CollisionResultLogical;
	resultPhysical: CollisionResultPhysical;
	closestPoint: Vector2;
	tempV: Vector2;
	tempP: Vector2;
	publicPosition: Vector2;
	publicVelocity: Vector2;
	gfxColor: number;

	constructor(
		playerId: number,
		inputSource: InputSourceBase,
		x: number,
		y: number,
		color: number
	) {
		this.playerId = playerId;
		this.inputSource = inputSource;
		this.position = new Vector2(x, y);
		this.gfxColor = color;
		this.velocity = new Vector2(0, 0);
		this.oldPosition = new Vector2(0, 0);
		this.r = 10;
		this.impulseScale = 40 / SimulationRate;
		this.maxSpeedAir = this.r * 0.5 * (40 / SimulationRate);
		this.maxSpeedGround = this.r * 0.5 * (40 / SimulationRate);
		this.groundAccel = 0.15 * (40 / SimulationRate) * (40 / SimulationRate);
		this.airAccel = 0.1 * (40 / SimulationRate) * (40 / SimulationRate);
		this.normGrav = 0.15 * (40 / SimulationRate) * (40 / SimulationRate);
		this.jumpGrav = 0.025 * (40 / SimulationRate) * (40 / SimulationRate);
		this.normDrag = Math.pow(0.99, 40 / SimulationRate);
		this.winDrag = Math.pow(0.8, 40 / SimulationRate);
		this.wallFriction = Math.pow(0.87, 40 / SimulationRate);
		this.skidFriction = Math.pow(0.92, 40 / SimulationRate);
		this.standFriction = Math.pow(0.8, 40 / SimulationRate);
		this.g = this.normGrav;
		this.d = this.normDrag;
		this.currentState = PlayerState.STATE_DISABLED;
		this.facingDirection = 1;
		this.jumpAmount = 1;
		this.jumpYBias = 2;
		this.maxJumpTime = 30 * (SimulationRate / 40);
		this.terminalVelocity = this.r * 0.9 * (40 / SimulationRate);
		this.jumpTimer = 0;
		this.wasJumpHeld = false;
		this.wasInAir = false;
		this.oldVelocity = new Vector2(0, 0);
		this.inAir = false;
		this.nearWall = false;
		this.wallN = new Vector2(0, 0);
		this.floorN = new Vector2(0, -1);
		this.fCount = 1;
		this.fVector = new Vector2();
		this.raggy = new Ragdoll();
		// this.ninja_gfx = null;
		this.crushThreshold = 0.05;
		this.crushVector = new Vector2();
		this.crushDistance = 0;
		this.crushFlag = false;
		this.deathType = PlayerDeathType.TIME;
		this.deathPosition = new Vector2();
		this.deathForce = new Vector2();
		this.tmpNearPosition = new Vector2();
		this.entityList = [];
		this.resultLogical = new CollisionResultLogical();
		this.resultPhysical = new CollisionResultPhysical();
		this.closestPoint = new Vector2();
		this.tempV = new Vector2();
		this.tempP = new Vector2();
		this.publicPosition = new Vector2();
		this.publicVelocity = new Vector2();
	}

	isDead(): boolean {
		return (
			this.currentState === PlayerState.STATE_DEAD ||
			this.currentState === PlayerState.STATE_DISABLED
		);
	}

	getPosition(): Vector2 {
		this.publicPosition.setFrom(this.position);
		return this.publicPosition;
	}

	getVelocity(): Vector2 {
		this.publicVelocity.setFrom(this.velocity);
		return this.publicVelocity;
	}

	getRadius(): number {
		return this.r;
	}

	kill(
		type: PlayerKillType,
		x: number,
		y: number,
		forceX: number,
		forceY: number
	): void {
		if (
			this.currentState === PlayerState.STATE_AWAITINGDEATH ||
			this.currentState === PlayerState.STATE_DISABLED
		) {
			return;
		}
		this.deathType = PlayerKillTypeToDeathType[type];
		this.deathPosition.x = x;
		this.deathPosition.y = y;
		this.deathForce.x = forceX;
		this.deathForce.y = forceY;
		this.exitCurrentState();
		this.currentState = PlayerState.STATE_AWAITINGDEATH;
	}

	win(): void {
		if (
			this.currentState === PlayerState.STATE_DISABLED ||
			this.currentState === PlayerState.STATE_CELEBRATING ||
			this.currentState === PlayerState.STATE_AWAITINGDEATH ||
			this.currentState === PlayerState.STATE_DEAD
		) {
			return false;
		}
		this.exitCurrentState();
		this.currentState = PlayerState.STATE_CELEBRATING;
		return true;
	}

	enable(): void {
		this.currentState = PlayerState.STATE_STANDING;
	}

	exitCurrentState(): void {
		if (this.currentState === PlayerState.STATE_DEAD) {
			throw new Error(
				`exitCurrentState() was called on a dead player!: ${this.playerId}`
			);
		}
		if (this.currentState === PlayerState.STATE_JUMPING) {
			this.g = this.normGrav;
		}
	}

	integrate(): void {
		if (this.currentState !== PlayerState.STATE_DISABLED) {
			if (this.currentState === PlayerState.STATE_DEAD) {
				this.raggy.integrate(this.normGrav);
			} else {
				this.velocity.x *= this.d;
				this.velocity.y *= this.d;
				this.velocity.y += this.g;
				this.position.x += this.velocity.x;
				this.position.y += this.velocity.y;
			}
		}
	}

	preCollision(): void {
		if (this.currentState !== PlayerState.STATE_DISABLED) {
			if (this.currentState !== PlayerState.STATE_DEAD) {
				this.oldVelocity.x = this.velocity.x;
				this.oldVelocity.y = this.velocity.y;
				this.fCount = 0;
				this.fVector.x = 0;
				this.fVector.y = 0;
				this.crushVector.x = 0;
				this.crushVector.y = 0;
				this.crushDistance = 0;
				this.crushFlag = false;
			}
		}
	}

	solveInternalConstraints(): void {
		if (this.currentState === PlayerState.STATE_DEAD) {
			this.raggy.solveConstraints();
		}
	}

	private respondToCollision(
		param1: number,
		param2: number,
		param3: number,
		param4: boolean,
		param5: boolean
	): void {
		this.position.x += param3 * param1;
		this.position.y += param3 * param2;
		if (param5) {
			this.crush_flag = true;
		}
		if (param4 || param5) {
			this.crushVector.x += param3 * param1;
			this.crushVector.y += param3 * param2;
			this.crushDistance += Math.abs(param3);
		}
		if (param4) {
			const _loc6_ = this.velocity.x * param1 + this.velocity.y * param2;
			if (_loc6_ < 0) {
				this.velocity.x -= _loc6_ * param1;
				this.velocity.y -= _loc6_ * param2;
			}
		} else {
			this.velocity.x += param3 * param1;
			this.velocity.y += param3 * param2;
		}
		if (param2 < 0) {
			++this.fcount;
			this.fVector.x += param1;
			this.fVector.y += param2;
		}
	}

	collideVsObjects(simulator: Simulator): void {
		if (this.currentState === PlayerState.STATE_DEAD) {
			this.raggy.collideVsObjects(simulator);
		} else {
			this.resultPhysical.clear();
			const entityList = simulator.entityGrid.gatherCellContentsInNeighbourhood(
				this.position
			);
			for (const entity of entityList) {
				if (
					entity.collideVsCirclePhysical(
						this.resultPhysical,
						this.position,
						this.velocity,
						this.oldPosition,
						this.r
					)
				) {
					this.respondToCollision(
						this.resultPhysical.nx,
						this.resultPhysical.ny,
						this.resultPhysical.pen,
						this.resultPhysical.isHardCollision,
						entity
					);
				}
			}
		}
	}

	collideVsTiles(simulator: Simulator): void {
		if (this.currentState === PlayerState.STATE_DEAD) {
			this.raggy.collideVsTiles(simulator);
		} else {
			const maxIterations = 32;
			let currentIteration = 0;
			const closestPoint = new Vector2(0, 0);
			const _loc4_ = getSingleClosestPointSigned(
				simulator.segGrid,
				this.position,
				this.r,
				closestPoint
			);
			while (_loc4_ !== 0) {
				const _loc5_ = this.position.x - closestPoint.x;
				const _loc6_ = this.position.y - closestPoint.y;
				const _loc7_ = Math.sqrt(_loc5_ * _loc5_ + _loc6_ * _loc6_);
				const _loc8_ = this.r - _loc4_ * _loc7_;
				if (_loc8_ < 1e-7) {
					break;
				}
				if (_loc7_ === 0) {
					return;
				}
				_loc5_ /= _loc7_;
				_loc6_ /= _loc7_;
				this.respondToCollision(_loc5_, _loc6_, _loc4_ * _loc8_, true, false);
				currentIteration++;
				if (currentIteration === maxIterations) {
					throw new Error(
						`WARNING! collision loop hit max iterations: ${_loc8_}`
					);
				}
			}
		}
	}

	postCollision(simulator: Simulator): void {
		let _loc2_ = NaN;
		if (this.currentState !== PSTATE_DISABLED) {
			if (this.currentState === PSTATE_DEAD) {
				this.raggy.postCollision(simulator);
			} else {
				this.oldPosition.setFrom(this.position);
				_loc2_ = 0.1;
				const wallListX = [];
				const wallListY = [];
				this.resultLogical.clear();
				const entities = simulator.entityGrid.gatherCellContentsInNeighbourhood(
					this.position
				);
				for (const entity of entities) {
					if (
						entity.collideVsCircleLogical(
							simulator,
							this,
							this.resultLogical,
							this.position,
							this.velocity,
							this.oldPosition,
							this.r,
							_loc2_
						)
					) {
						if (this.resultLogical.vectorY === 0) {
							wallListX.push(this.resultLogical.vectorX);
							wallListY.push(this.resultLogical.vectorY);
						}
					}
				}

				const offset = this.r + _loc2_;
				const segments = simulator.segGrid.gatherCellContentsFromWorldspaceRegion(
					this.position.x - offset,
					this.position.y - offset,
					this.position.x + offset,
					this.position.y + offset
				);
				for (const segment of segments) {
					const segmentClosestPoint = new Vector2();
					segment.getClosestPoint(this.position, segmentClosestPoint);
					const _loc7_ = this.position.x - segmentClosestPoint.x;
					const _loc8_ = this.position.y - segmentClosestPoint.y;
					const _loc9_ = Math.sqrt(_loc7_ * _loc7_ + _loc8_ * _loc8_);
					if (_loc8_ === 0 && _loc9_ <= offset && _loc9_ !== 0) {
						_loc7_ *= 1 / _loc9_;
						_loc8_ *= 1 / _loc9_;
						wallListX.push(_loc7_);
						wallListY.push(_loc8_);
					}
				}

				this.wasInAir = this.inAir;
				this.inAir = true;
				this.nearWall = false;
				if (wallListX.length > 0) {
					this.nearWall = true;
					this.wallN.x = wallListX[0];
					this.wallN.y = 0;
				}
				if (this.fCount > 0) {
					this.inAir = false;
					const lengthOfFVector = this.fVector.length();
					if (lengthOfFVector === 0) {
						throw new Error(
							`WARNING! Ninja found a null floor vector: ${this.fVector.toString()}`
						);
					} else {
						this.floorN.x = this.fVector.x / lengthOfFVector;
						this.floorN.y = this.fVector.y / lengthOfFVector;
					}
					if (this.wasInAir) {
						const _loc11_ =
							this.oldVelocity.x * this.floorN.x +
							this.oldVelocity.y * this.floorN.y -
							2 * Math.abs(this.floorN.y) * this.impulseScale;

						if (_loc11_ < -this.terminalVelocity) {
							this.velocity.setFrom(this.oldVelocity);
							simulator.killPlayer(
								this,
								PlayerKillType.FALL,
								this.position.x,
								this.position.y,
								0,
								0
							);
						}
					}
				}
				if (this.crushFlag) {
					if (this.crushDistance > 0) {
						if (
							this.crushVector.length() / this.crushDistance <
							this.crushThreshold
						) {
							simulator.killPlayer(
								this,
								PlayerKillType.CRUSH,
								this.position.x,
								this.position.y,
								0,
								0
							);
						}
					}
				}
			}
		}
	}

	think(simulator: Simulator, frameNumber: number): void {
		let _loc10_: Vector2[] = null;
		let _loc11_: Vector2[] = null;
		let _loc12_ = false;
		let _loc13_ = NaN;
		let _loc14_ = NaN;
		let _loc15_ = NaN;
		let _loc16_ = NaN;
		let _loc17_ = NaN;
		let _loc18_ = NaN;
		let _loc19_ = NaN;
		let _loc20_ = NaN;
		let _loc21_ = NaN;
		let _loc22_ = NaN;
		let _loc23_ = NaN;
		let _loc24_ = NaN;
		let _loc25_ = NaN;
		let _loc26_ = NaN;
		let _loc27_ = NaN;
		let _loc28_ = NaN;
		let _loc29_ = NaN;
		let _loc30_ = NaN;
		let _loc31_ = NaN;
		let _loc32_ = NaN;
		let _loc33_ = NaN;
		let _loc34_ = NaN;
		let _loc35_ = NaN;
		let _loc36_ = NaN;
		let _loc37_ = NaN;
		let _loc38_ = NaN;
		let _loc39_ = NaN;
		let _loc40_ = NaN;
		let _loc41_ = NaN;
		this.inputSource.tick(frameNumber);
		const _loc3_ = this.inputSource.isButtonDownRight();
		const _loc4_ = this.inputSource.isButtonDownLeft();
		const _loc5_ = this.inputSource.isButtonDownJumping();
		const _loc6_: boolean = _loc5_ && !this.wasJumpHeld;
		this.wasJumpHeld = _loc5_;
		if (this.curState === PlayerState.STATE_DISABLED) {
			return;
		}
		if (this.curState === PlayerState.STATE_DEAD) {
			return;
		}
		if (this.curState === PlayerState.STATE_AWAITINGDEATH) {
			_loc10_ = null;
			_loc11_ = null;
			// if (this.ninja_gfx !== null && this.ninja_gfx.hasValidPose) {
			// 	_loc10_ = new Array<Vector2>(6);
			// 	_loc11_ = new Array<Vector2>(6);
			// 	this.ninja_gfx.NINJA_GetCurrentPose(_loc10_, _loc11_);
			// }
			this.raggy.activateRagdoll(
				this.position,
				this.velocity,
				this.deathPosition,
				this.deathForce,
				_loc10_,
				_loc11_
			);
			if (
				this.deathType === PlayerDeathType.EXPLOSIVE ||
				this.deathType === PlayerDeathType.SUICIDE
			) {
				this.raggy.explodeRagdoll(simulator);
			}
			// simulator
			// 	.HACKY_GetParticleManager()
			// 	.Spawn_BloodSpurt(
			// 		this.death_pos.x,
			// 		this.death_pos.y,
			// 		this.death_force.x,
			// 		this.death_force.y,
			// 		3 + Math.floor(Math.random() * 4)
			// 	);
			_loc12_ = Math.random() < 0.5;
			if (this.death_type === PlayerDeathType.EXPLOSIVE) {
				if (_loc12_) {
					// this.ninja_gfx.HACKY_PlayOneshotSound("explode1");
				} else {
					// this.ninja_gfx.HACKY_PlayOneshotSound("explode2");
				}
			} else if (this.deathType === PlayerDeathType.FALL) {
				// this.ninja_gfx.HACKY_PlayOneshotSound("fall");
			} else if (this.deathType === PlayerDeathType.LASER) {
				// this.ninja_gfx.HACKY_PlayOneshotSound("laser");
			} else if (this.death_type === PlayerDeathType.ELECTRIC) {
				if (_loc12_) {
					// this.ninja_gfx.HACKY_PlayOneshotSound("zap1");
				} else {
					// this.ninja_gfx.HACKY_PlayOneshotSound("zap2");
				}
			} else if (_loc12_) {
				// this.ninja_gfx.HACKY_PlayOneshotSound("shot1");
			} else {
				// this.ninja_gfx.HACKY_PlayOneshotSound("shot2");
			}
			this.currentState = PlayerState.STATE_DEAD;
			return;
		}

		if (this.currentState === PlayerState.STATE_CELEBRATING) {
			if (this.inAir) {
				this.d = this.normDrag;
			} else {
				this.d = this.winDrag;
			}
			return;
		}

		this.tempV.x = 0;
		this.tempV.y = 0;
		this.tempP.x = 0;
		this.tempP.y = 0;
		let _loc7_ = this.velocity.x;
		let _loc8_ = this.velocity.y;
		let _loc9_ = 0;
		if (_loc4_) {
			_loc9_--;
		}
		if (_loc3_) {
			_loc9_ += 1;
		}
		if (this.inAir) {
			this.tempV.setFrom(this.velocity);
			_loc13_ = _loc7_ + _loc9_ * this.airAccel;
			if (Math.abs(_loc13_) < this.maxSpeedAir) {
				_loc7_ = _loc13_;
			}
			this.velocity.x = _loc7_;
			if (this.currentState < 3) {
				this.fall();
				return;
			}
			if (this.currentState === PlayerState.STATE_JUMPING) {
				++this.jumpTimer;
				if (!_loc5_ || this.jumpTimer > this.maxJumpTime) {
					this.fall();
					return;
				}
				return;
			}

			if (this.nearWall) {
				if (_loc6_) {
					_loc14_ = 0;
					_loc15_ = 0;
					if (
						this.currentState === PlayerState.STATE_WALLSLIDING &&
						_loc9_ * this.wallN.x < 0
					) {
						_loc14_ = 1;
						_loc15_ = 0.5;
					} else {
						_loc14_ = 1.5;
						_loc15_ = 0.7;
					}
					// param1
					// 	.HACKY_GetParticleManager()
					// 	.Spawn_JumpDust(
					// 		this.pos.x - this.wallN.x * this.r,
					// 		this.pos.y - this.wallN.y * this.r,
					// 		this.wallN.x * 90
					// 	);
					this.jump(this.wallN.x * _loc14_, this.wallN.y - _loc15_);
					return;
				}
				if (this.currentState === PlayerState.STATE_WALLSLIDING) {
					if (0 < _loc9_ * this.wallN.x) {
						this.fall();
						return;
					}
					_loc16_ = Math.abs(_loc8_);
					_loc17_ = -this.wallFriction * _loc16_;
					this.tempV.setFrom(this.velocity);
					this.velocity.y *= this.wallFriction;
					// param1
					// 	.HACKY_GetParticleManager()
					// 	.Spawn_WallDust(this.pos, this.r, this.wallN, Math.min(4, _loc16_));
					return;
				}
				if (0 < _loc8_ && _loc9_ * this.wallN.x < 0) {
					this.wallSlide();
					return;
				}
			} else if (this.currentState === PlayerState.STATE_WALLSLIDING) {
				this.fall();
				return;
			}
		} else {
			this.tempV.setFrom(this.velocity);
			_loc18_ = _loc7_ + _loc9_ * this.groundAccel;
			if (Math.abs(_loc18_) < this.maxSpeedGround) {
				_loc7_ = _loc18_;
			}
			this.velocity.x = _loc7_;
			if (2 < this.currentState) {
				// param1
				// 	.HACKY_GetParticleManager()
				// 	.Spawn_LandDust(
				// 		this.pos.x - this.floorN.x * this.r,
				// 		this.pos.y - this.floorN.y * this.r,
				// 		90 + (Math.atan2(this.floorN.y, this.floorN.x) / Math.PI) * 180,
				// 		Math.abs(this.vel.x) + this.vel.y
				// 	);
				// this.ninja_gfx.HACKY_PlayOneshotSound("land");
				if (0 < _loc7_ * _loc9_) {
					this.run();
					return;
				}
				this.skid();
				return;
			}
			if (_loc6_) {
				// param1
				// 	.HACKY_GetParticleManager()
				// 	.Spawn_JumpDust(
				// 		this.pos.x - this.floorN.x * this.r,
				// 		this.pos.y - this.floorN.y * this.r,
				// 		90 + (Math.atan2(this.floorN.y, this.floorN.x) / Math.PI) * 180
				// 	);
				if (_loc9_ * this.floorN.x < 0) {
					this.jump(0, -0.7);
					return;
				}
				this.jump(this.floorN.x, this.floorN.y);
				return;
			}
			if (this.currentState !== PlayerState.STATE_RUNNING) {
				if (this.currentState === PlayerState.STATE_SKIDDING) {
					_loc29_ = this.floorN.x;
					_loc30_ = this.floorN.y;
					_loc31_ = Math.abs(_loc7_ * -_loc30_ + _loc8_ * _loc29_);
					_loc32_ = _loc7_ * _loc31_;
					if (0 < _loc32_ * _loc9_) {
						this.run();
						return;
					}
					if (_loc31_ < 0.1 && this.floorN.x === 0) {
						this.stand();
						return;
					}
					_loc33_ = 1;
					if (_loc32_ < 0) {
						_loc33_ = -1;
					}
					_loc34_ = Math.atan2(this.floorN.x, -this.floorN.y) * (180 / Math.PI);
					// param1
					// 	.HACKY_GetParticleManager()
					// 	.Spawn_FloorDust(
					// 		this.pos,
					// 		this.r,
					// 		this.floorN,
					// 		_loc34_,
					// 		_loc33_,
					// 		_loc31_
					// 	);
					this.tempV.setFrom(this.velocity);
					if (_loc8_ < 0 && this.floorN.x !== 0) {
						_loc35_ = Math.abs(_loc7_ * this.skidFriction - _loc7_);
						_loc36_ =
							(_loc36_ = Math.abs(_loc35_ * this.floorN.y)) *
							(this.floorN.y * this.floorN.y);
						_loc38_ =
							(_loc37_ = Math.sqrt(_loc7_ * _loc7_ + _loc8_ * _loc8_)) -
							_loc36_;
						_loc7_ /= _loc37_;
						_loc8_ /= _loc37_;
						_loc7_ *= _loc38_;
						_loc8_ *= _loc38_;
					} else {
						_loc7_ *= this.skidFriction;
					}
					this.velocity.x = _loc7_;
					this.velocity.y = _loc8_;
					return;
				}
				if (_loc9_ !== 0) {
					this.run(_loc9_);
					return;
				}
				_loc39_ = this.floorN.x;
				_loc40_ = this.floorN.y;
				_loc41_ = Math.abs(_loc7_ * -_loc40_ + _loc8_ * _loc39_);
				if (0.1 <= _loc41_) {
					this.skid();
					return;
				}
				this.tempV.setFrom(this.velocity);
				_loc7_ *= this.standFriction;
				this.velocity.x = _loc7_;
				this.velocity.y = _loc8_;
				return;
			}
			_loc19_ = this.floorN.x;
			_loc20_ = this.floorN.y;
			_loc21_ = _loc7_ * -_loc20_ + _loc8_ * _loc19_;
			_loc22_ = Math.abs(_loc21_);
			_loc23_ = _loc7_ * _loc22_;
			if (_loc9_ * _loc23_ <= 0) {
				this.skid();
				return;
			}
			if (_loc9_ * _loc19_ < 0) {
				_loc24_ = -Math.abs(_loc19_);
				_loc25_ = _loc20_;
				if (_loc19_ < 0) {
					_loc25_ = -_loc20_;
				}
				_loc26_ = Math.abs(_loc20_);
				_loc25_ *= 0.5 * _loc26_;
				_loc24_ *= 0.5 * _loc26_;
				_loc27_ = _loc7_ + _loc25_ * this.groundAccel;
				_loc28_ = _loc8_ + _loc24_ * this.groundAccel;
				if (Math.abs(_loc18_) < this.maxSpeedGround) {
					_loc7_ = _loc27_;
					_loc8_ = _loc28_;
				}
				this.tempV.setFrom(this.velocity);
				this.velocity.x = _loc7_;
				this.velocity.y = _loc8_;
			}
		}
	}

	private fall(): void {
		this.exitCurrentState();
		this.currentState = PlayerState.STATE_FALLING;
	}

	private wallSlide(): void {
		this.exitCurrentState();
		this.currentState = PlayerState.STATE_WALLSLIDING;
	}

	private run(): void {
		this.exitCurrentState();
		this.currentState = PlayerState.STATE_RUNNING;
	}

	private stand(): void {
		this.exitCurrentState();
		this.currentState = PlayerState.STATE_STANDING;
	}

	private skid(): void {
		this.exitCurrentState();
		this.currentState = PlayerState.STATE_SKIDDING;
	}

	private jump(param1: number, param2: number): void {
		this.exitCurrentState();
		this.currentState = PlayerState.STATE_JUMPING;
		this.g = this.jumpGrav;
		const _loc3_ = this.velocity.x;
		const _loc4_ = this.velocity.y;
		if (_loc3_ * param1 < 0) {
			this.velocity.x = 0;
		}
		if (_loc4_ * param2 < 0) {
			this.velocity.y = 0;
		}
		this.position.x += param1 * this.jumpAmount * this.impulseScale;
		this.position.y +=
			param2 * (this.jumpAmount + this.jumpYBias) * this.impulseScale;
		this.velocity.x += param1 * this.jumpAmount * this.impulseScale;
		this.velocity.y +=
			param2 * (this.jumpAmount + this.jumpYBias) * this.impulseScale;
		this.jumpTimer = 0;
		// this.ninja_gfx.HACKY_PlayOneshotSound("jump");
	}
}
