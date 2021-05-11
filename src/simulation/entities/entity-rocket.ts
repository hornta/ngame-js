import type { EntityGraphics } from "../../graphics/entity-graphics.js";
import { overlapCircleVsCircle, tryToAcquireTarget } from "../../fns.js";
import type { CollisionResultLogical } from "../collision-result-logical.js";
import type { Ninja } from "../ninja.js";
import { PlayerKillType, SimulationRate, Simulator } from "../simulator.js";
import { Vector2 } from "../vector2.js";
import { EntityBase } from "./entity-base";
import type { GraphicsManager } from "../../graphics-manager.js";

enum RocketState {
	IDLE = 0,
	PREFIRE = 1,
	HOMING = 2,
}
export class EntityRocket extends EntityBase {
	private maxSpeed: number;
	private accelStart: number;
	private accelRate: number;
	private turnRate: number;
	private prefireDelay: number;
	private predictionScale: number;
	private gfxPrevState: number;
	private rocketPos: Vector2;
	private rocketDir: Vector2;
	private rocketSpeed: number;
	private rocketAccel: number;
	private shotTimer: number;
	private currentState: RocketState;
	private targetIndex: number;
	private oldPosition: Vector2;
	private rocketVelocity: Vector2;
	private hitPosition: Vector2;
	private hitNormal: Vector2;

	constructor(position: Vector2) {
		super(position);
		this.accelStart = 0.1 * (40 / SimulationRate) * (40 / SimulationRate);
		this.maxSpeed = 12 * (2 / 7) * (40 / SimulationRate);
		this.accelRate = Math.pow(1.1, 40 / SimulationRate);
		this.turnRate = 0.1 * (40 / SimulationRate);
		this.prefireDelay = 10 * (SimulationRate / 40);
		this.predictionScale = SimulationRate / 40;
		this.rocketPos = this.position.clone();
		this.rocketDir = new Vector2(1, 0);
		this.rocketSpeed = 0;
		this.rocketAccel = this.accelStart;
		this.shotTimer = 0;
		this.currentState = RocketState.IDLE;
		this.targetIndex = -1;
		this.gfxPrevState = this.currentState;
		this.oldPosition = new Vector2();
		this.rocketVelocity = new Vector2();
		this.hitPosition = new Vector2();
		this.hitNormal = new Vector2();
	}

	collideVsNinjaLogical(
		simulator: Simulator,
		ninja: Ninja,
		collision: CollisionResultLogical,
		param4: Vector2,
		param5: Vector2,
		param6: Vector2,
		param7: number,
		param8: number
	): boolean {
		if (this.currentState !== RocketState.HOMING) {
			throw new Error(
				`WARNING! EntityRocket.collideVsNinjaLogical() was called with a rocket that's not active.. this should be impossible, the rocket shouldn't be in the grid?! ${this.currentState}`
			);
		}
		if (overlapCircleVsCircle(this.rocketPos, 0, param4, param7)) {
			this.explode(simulator);
			const _loc9_ = param4.x - this.rocketPos.x;
			const _loc10_ = param4.y - this.rocketPos.y;
			if (ninja === null) {
				collision.vectorX = _loc9_ * 4;
				collision.vectorY = _loc10_ * 4;
				return true;
			}
			simulator.killPlayer(
				ninja,
				PlayerKillType.ROCKET,
				this.rocketPos.x,
				this.rocketPos.y,
				_loc9_,
				_loc10_
			);
		}
		return false;
	}

	think(simulator: Simulator): void {
		let _loc3_ = NaN;
		let _loc4_ = NaN;
		let _loc5_ = NaN;
		let _loc6_ = NaN;
		let _loc10_ = NaN;
		let _loc11_ = NaN;
		let _loc12_ = NaN;
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
		this.gfxPrevState = this.currentState;
		if (this.currentState === RocketState.IDLE) {
			const _loc2_ = tryToAcquireTarget(
				this.position,
				simulator.playerList,
				simulator.segGrid
			);
			if (0 <= _loc2_) {
				this.shotTimer = 0;
				this.currentState = RocketState.PREFIRE;
				this.targetIndex = _loc2_;
			}
		} else if (this.currentState === RocketState.PREFIRE) {
			if (simulator.playerList[this.targetIndex].isDead()) {
				this.currentState = RocketState.IDLE;
			} else {
				++this.shotTimer;
				if (this.prefireDelay <= this.shotTimer) {
					this.rocketPos.setFrom(this.position);
					this.rocketAccel = this.accelStart;
					this.rocketSpeed = 0;
					_loc3_ =
						simulator.playerList[this.targetIndex].getPosition().x -
						this.position.x;
					_loc4_ =
						simulator.playerList[this.targetIndex].getPosition().y -
						this.position.y;
					if ((_loc5_ = _loc3_ * _loc3_ + _loc4_ * _loc4_) !== 0) {
						_loc3_ /= Math.sqrt(_loc5_);
						_loc4_ /= Math.sqrt(_loc5_);
						this.rocketDir.x = _loc3_;
						this.rocketDir.y = _loc4_;
					} else {
						throw new Error(
							`WARNING! EntityRocket.think() found a player coincident with the rocket about to be launched!: ${_loc3_},${_loc4_}`
						);
						this.rocketDir.x = 1;
						this.rocketDir.y = 0;
					}
					simulator.entityGrid.addEntity(this.rocketPos, this);
					this.currentState = RocketState.HOMING;
				}
			}
		} else if (this.currentState === RocketState.HOMING) {
			if (this.rocketSpeed < this.maxSpeed) {
				this.rocketAccel *= this.accelRate;
				this.rocketSpeed += this.rocketAccel;
			} else {
				this.rocketSpeed = this.maxSpeed;
			}
			this.oldPosition.setFrom(this.rocketPos);
			this.rocketVelocity.x = this.rocketSpeed * this.rocketDir.x;
			this.rocketVelocity.y = this.rocketSpeed * this.rocketDir.y;
			this.rocketPos.x += this.rocketVelocity.x;
			this.rocketPos.y += this.rocketVelocity.y;
			simulator.entityGrid.moveEntity(this.rocketPos, this);
			const nearSegments = simulator.segGrid.gatherCellContentsFromWorldspaceRegion(
				Math.min(this.oldPosition.x, this.rocketPos.x),
				Math.min(this.oldPosition.y, this.rocketPos.y),
				Math.max(this.oldPosition.x, this.rocketPos.x),
				Math.max(this.oldPosition.y, this.rocketPos.y)
			);
			this.hitPosition.x = 0;
			this.hitPosition.y = 0;
			this.hitNormal.x = 0;
			this.hitNormal.y = 0;
			_loc6_ = 2;
			for (const segment of nearSegments) {
				const _loc9_ = segment.intersectWithRay(
					this.oldPosition,
					this.rocketVelocity,
					this.hitPosition,
					this.hitNormal
				);
				if (_loc9_ === -1) {
					this.explode(simulator);
					return;
				}
				if (_loc9_ < _loc6_) {
					_loc6_ = _loc9_;
				}
			}

			if (_loc6_ < 2) {
				this.explode(simulator);
				return;
			}
			if (!simulator.playerList[this.targetIndex].isDead()) {
				_loc10_ = this.rocketVelocity.x * this.predictionScale;
				_loc11_ = this.rocketVelocity.y * this.predictionScale;
				_loc12_ =
					simulator.playerList[this.targetIndex].getVelocity().x *
					this.predictionScale;
				_loc13_ =
					simulator.playerList[this.targetIndex].getVelocity().y *
					this.predictionScale;
				_loc14_ = this.rocketPos.x + _loc10_;
				_loc15_ = this.rocketPos.y + _loc11_;
				_loc16_ =
					simulator.playerList[this.targetIndex].getPosition().x + _loc12_;
				_loc17_ =
					simulator.playerList[this.targetIndex].getPosition().y + _loc13_;
				_loc18_ = _loc16_ - _loc14_;
				_loc19_ = _loc17_ - _loc15_;
				if ((_loc20_ = _loc18_ * _loc18_ + _loc19_ * _loc19_) === 0) {
					return;
				}
				_loc18_ /= Math.sqrt(_loc20_);
				_loc19_ /= Math.sqrt(_loc20_);
				_loc21_ = -this.rocketDir.y;
				_loc22_ = this.rocketDir.x;
				_loc23_ = _loc21_ * _loc18_ + _loc22_ * _loc19_;
				this.rocketDir.x += this.turnRate * _loc23_ * _loc21_;
				this.rocketDir.y += this.turnRate * _loc23_ * _loc22_;
				if ((_loc24_ = this.rocketDir.length()) === 0) {
					this.rocketDir.x = 0;
					this.rocketDir.y = 0;
				} else {
					this.rocketDir.scale(1 / _loc24_);
				}
			}
			// simulator
			// 	.HACKY_GetParticleManager()
			// 	.Spawn_RocketSmoke(
			// 		this.rocket_pos,
			// 		(Math.atan2(this.rocket_dir.y, this.rocket_dir.x) / Math.PI) * 180
			// 	);
		}
	}

	generateGraphicComponent(): EntityGraphics | null {
		// return new EntityGraphics_Rocket(this, this.pos.x, this.pos.y);
		return null;
	}

	debugDraw(gfx: GraphicsManager): void {
		// param1.SetStyle(0, 0, 100);
		// param1.DrawCircle(this.pos.x, this.pos.y, 4);
		// if (this.CUR_STATE == STATE_PREFIRE) {
		// 	param1.DrawSquare(this.pos.x, this.pos.y, 4);
		// } else {
		// 	param1.DrawSquare(this.pos.x, this.pos.y, 2);
		// 	if (this.CUR_STATE == STATE_HOMING) {
		// 		param1.DrawLine(
		// 			this.rocket_pos.x,
		// 			this.rocket_pos.y,
		// 			this.rocket_pos.x - 4 * this.rocket_dir.x,
		// 			this.rocket_pos.y - 4 * this.rocket_dir.y
		// 		);
		// 	}
		// }
	}

	private explode(simulator: Simulator): void {
		simulator.entityGrid.removeEntity(this);
		this.currentState = RocketState.IDLE;
		this.targetIndex = -1;
		// simulator.HACKY_GetParticleManager().Spawn_Explosion(this.rocketPos);
	}
}
