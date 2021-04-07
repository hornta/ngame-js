import { overlapCircleVsSegment, wrapAngleShortest } from "src/fns";
import type { GridEntity } from "../grid-entity";
import { PlayerKillType, SimulationRate, Simulator } from "../simulator";
import type { Vector2 } from "../vector2";
import { EntityDroneShooterBase } from "./entity-drone-shooter-base";

const CHAINGUN_MAX_BULLETS = 6;
const CHAINGUN_SPREAD = 0.3;

export class EntityDroneChaingun extends EntityDroneShooterBase {
	chaingunRate: number;
	chaingunCount: number;
	chaingunTimer: number;
	chaingunDirection: Vector2;
	chaingunSweep: Vector2;
	chaingunHitMode: number;
	chaingunHitPosition: Vector2;
	chaingunHitNormal: Vector2;

	constructor(
		entityGrid: GridEntity,
		x: number,
		y: number,
		facingDirection: number,
		moveType: number
	) {
		const speed = 12 * (1 / 14) * 0.75 * (40 / SimulationRate);
		const prefireDelay = 35 * (SimulationRate / 40);
		const postfireDelay = 60 * (SimulationRate / 40);
		super(
			entityGrid,
			x,
			y,
			speed,
			facingDirection,
			moveType,
			prefireDelay,
			postfireDelay
		);
		this.chaingun_rate = 6 * (SimulationRate / 40);
		this.chaingunCount = 0;
		this.chaingunTimer = 0;
		this.chaingunDirection = new Vector2();
		this.chaingunSweep = new Vector2();
		this.chaingunHitMode = 0;
		this.chaingunHitPosition = new Vector2();
		this.chaingunHitNormal = new Vector2();
	}

	startPrefiring(simulator: Simulator, param2: Vector2): void {}

	updatePrefiring(simulator: Simulator, param2: Vector2): void {
		const _loc3_ = param2.x - this.position.x;
		const _loc4_ = param2.y - this.position.y;
		const _loc5_ = wrapAngleShortest(
			Math.atan2(_loc4_, _loc3_) - this.gfxOrientation
		);
		this.gfxOrientation += 0.2 * _loc5_;
	}

	startFiring(simulator: Simulator, param2: Vector2, param3: Vector2): void {
		this.chaingunCount = 0;
		this.chaingunTimer = 0;
		this.chaingunHitMode = 0;
		const _loc4_ = param2.x - this.position.x;
		const _loc5_ = param2.y - this.position.y;
		let _loc6_ = Math.sqrt(_loc4_ * _loc4_ + _loc5_ * _loc5_);
		if (_loc6_ === 0) {
			_loc6_ = param3.length();
			if (_loc6_ === 0) {
				this.chaingunDirection.x = 1;
				this.chaingunDirection.y = 0;
				this.chaingunSweep.x = 0;
				this.chaingunSweep.y = 0;
			} else {
				this.chaingunDirection.x = param3.x / _loc6_;
				this.chaingunDirection.y = param3.y / _loc6_;
				this.chaingunSweep.x = 0;
				this.chaingunSweep.y = 0;
			}
		} else {
			this.chaingunDirection.x = _loc4_ / _loc6_;
			this.chaingunDirection.y = _loc5_ / _loc6_;
			const _loc7_ =
				-this.chaingunDirection.y * param3.x +
				this.chaingunDirection.x * param3.y;
			if (_loc7_ < 0) {
				this.chaingunSweep.x = this.chaingunDirection.y;
				this.chaingunSweep.y = -this.chaingunDirection.x;
			} else {
				this.chaingunSweep.x = -this.chaingunDirection.y;
				this.chaingunSweep.y = this.chaingunDirection.x;
			}
		}
	}

	updateFiring(simulator: Simulator): boolean {
		let _loc2_ = NaN;
		let _loc3_ = NaN;
		let _loc4_ = NaN;
		let _loc5_ = NaN;
		let _loc8_ = NaN;
		let _loc9_ = NaN;
		let _loc10_ = NaN;
		++this.chaingunTimer;
		if (this.chaingunRate <= this.chaingunTimer) {
			this.chaingunTimer = 0;
			if (CHAINGUN_MAX_BULLETS < this.chaingunCount) {
				return true;
			}
			++this.chaingunCount;
			_loc2_ =
				(this.chaingunCount / CHAINGUN_MAX_BULLETS - 0.5) * CHAINGUN_SPREAD;
			_loc3_ = this.chaingunDirection.x + _loc2_ * this.chaingunSweep.x;
			_loc4_ = this.chaingunDirection.y + _loc2_ * this.chaingunSweep.y;
			_loc5_ = Math.sqrt(_loc3_ * _loc3_ + _loc4_ * _loc4_);
			_loc3_ /= _loc5_;
			_loc4_ /= _loc5_;
			this.gfxOrientation = Math.atan2(_loc4_, _loc3_);
			const rayDistance = simulator.segGrid.getRaycastDistance(
				this.position.x,
				this.position.y,
				_loc3_,
				_loc4_,
				this.chaingunHitPosition,
				this.chaingunHitNormal
			);
			// param1
			// 	.HACKY_GetParticleManager()
			// 	.Spawn_ChainBullet(pos, this.chaingunHitPosition);
			for (const player of simulator.playerList) {
				if (!player.isDead()) {
					if (
						overlapCircleVsSegment(
							player.getPosition(),
							player.getRadius(),
							pos,
							this.chaingunHitPosition,
							rayDistance
						)
					) {
						_loc8_ = player.getPosition().x - this.position.x;
						_loc9_ = player.getPosition().y - this.position.y;
						_loc10_ = _loc3_ * _loc8_ + _loc4_ * _loc9_;
						this.chaingunHitPosition.x = this.position.x + _loc10_ * _loc3_;
						this.chaingunHitPosition.y = this.position.y + _loc10_ * _loc4_;
						simulator.killPlayer(
							player,
							PlayerKillType.CHAINGUN,
							this.chaingunHitPosition.x,
							this.chaingunHitPosition.y,
							_loc3_ * 5,
							_loc4_ * 5
						);
					}
				}
			}
			this.chaingun_HACKY_hitmode = 1;
		}
		return false;
	}

	startPostfiring(simulator: Simulator): void {
		if (this.chaingunHitMode < 2) {
			this.chaingunHitMode = 0;
		}
	}

	// override public function GenerateGraphicComponent() : EntityGraphics
	// {
	// 	 return new EntityGraphics_Drone_Chaingun(this);
	// }

	// public function GFX_UpdateState(param1:EntityGraphics_Drone_Chaingun) : void
	// {
	// 	 param1.pos.x = pos.x;
	// 	 param1.pos.y = pos.y;
	// 	 param1.orn = gfxorn;
	// 	 var _loc2_:int = GetFiringState();
	// 	 if(_loc2_ == FIRING_STATE_IDLE)
	// 	 {
	// 			param1.anim = EntityGraphics_Drone_Chaingun.ANIM_MOVE;
	// 	 }
	// 	 else if(_loc2_ == FIRING_STATE_PREFIRING)
	// 	 {
	// 			param1.anim = EntityGraphics_Drone_Chaingun.ANIM_PREFIRE;
	// 	 }
	// 	 else if(_loc2_ == FIRING_STATE_POSTFIRING)
	// 	 {
	// 			param1.anim = EntityGraphics_Drone_Chaingun.ANIM_POSTFIRE;
	// 	 }
	// 	 else if(_loc2_ == FIRING_STATE_FIRING)
	// 	 {
	// 			param1.anim = EntityGraphics_Drone_Chaingun.ANIM_FIRING;
	// 	 }
	// }

	// override public function Debug_Draw(param1:SimpleRenderer) : void
	// {
	// 	 super.Debug_Draw(param1);
	// 	 param1.SetStyle(4,8947848,50);
	// 	 param1.DrawCircle(pos.x,pos.y,r / 2);
	// 	 if(this.chaingun_HACKY_hitmode == 1)
	// 	 {
	// 			param1.SetStyle(0,8947848,100 * (1 - Number(this.chaingun_timer) / Number(this.chaingun_rate)));
	// 			param1.DrawLine(pos.x,pos.y,this.chaingun_hit_pos.x,this.chaingun_hit_pos.y);
	// 			param1.DrawLine(this.chaingun_hit_pos.x,this.chaingun_hit_pos.y,this.chaingun_hit_pos.x + 4 * this.chaingun_hit_n.x,this.chaingun_hit_pos.y + 4 * this.chaingun_hit_n.y);
	// 	 }
	// }
}
