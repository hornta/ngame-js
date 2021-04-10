import type { CollisionResultLogical } from "./collision-result-logical";
import type { CollisionResultPhysical } from "./collision-result-physical";
import type { EntityBase } from "./entities/entity-base";
import type { EntityThwomp } from "./entities/entity-thwomp";
import { Ragdoll } from "./ragdoll";
import { PlayerKillType, SimulationRate, Simulator } from "./simulator";
import type { Vector2 } from "./vector2";

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
	deathType: number;
	deathPosition: Vector2;
	deathForce: Vector2;
	tmpNearPosition: Vector2;
	segmentList: Segment[];
	segmentClosestPoint: Vector2;
	wallListX: number[];
	wallListY: number[];
	resultLogical: CollisionResultLogical;
	resultPhysical: CollisionResultPhysical;
	closestPoint: Vector2;
	tempV: Vector2;
	tempP: Vector2;
	publicPosition: Vector2;
	publicVelocity: Vector2;
	gfxColor: number;

	constructor(playerId: number, x: number, y: number) {
		this.playerId = playerId;
		this.position = new Vector2(x, y);
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
		this.deathType = PlayerKillType.TIME;
		this.deathPosition = new Vector2();
		this.deathForce = new Vector2();
		this.tmpNearPosition = new Vector2();
		this.entityList = [];
		this.segmentList = [];
		this.segmentClosestPoint = new Vector2();
		this.wallListX = [];
		this.wallListY = [];
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
		this.deathType = type;
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

	collideVsTiles(): void {
		let _loc2_: int = 0;
		let _loc3_: int = 0;
		let _loc4_: int = 0;
		let _loc5_ = NaN;
		let _loc6_ = NaN;
		let _loc7_ = NaN;
		let _loc8_ = NaN;
		if (this.currentState === PlayerState.STATE_DEAD) {
			this.raggy.CollideVsTiles(param1);
		} else {
			_loc2_ = 32;
			_loc3_ = 0;
			this.cp.x = 0;
			this.cp.y = 0;
			while (
				(_loc4_ = colutils.GetSingleClosestPoint_Signed(
					param1.segGrid,
					this.pos,
					this.r,
					this.cp
				)) != 0
			) {
				_loc5_ = this.pos.x - this.cp.x;
				_loc6_ = this.pos.y - this.cp.y;
				_loc7_ = Math.sqrt(_loc5_ * _loc5_ + _loc6_ * _loc6_);
				if ((_loc8_ = this.r - _loc4_ * _loc7_) < 1e-7) {
					break;
				}
				if (_loc7_ == 0) {
					return;
				}
				_loc5_ /= _loc7_;
				_loc6_ /= _loc7_;
				this.RespondToCollision(_loc5_, _loc6_, _loc4_ * _loc8_, true, false);
				_loc3_++;
				if (_loc3_ >= _loc2_) {
					trace(`WARNING! collision loop hit max iterations: ${_loc8_}`);
					break;
				}
			}
		}
	}
}
