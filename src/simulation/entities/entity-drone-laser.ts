import type { EntityGraphics } from "../../graphics/entity-graphics.js";
import { overlapCircleVsSegment } from "../../fns";
import type { GridEntity } from "../grid-entity";
import { PlayerKillType, SimulationRate, Simulator } from "../simulator";
import { Vector2 } from "../vector2.js";
import { EntityDroneShooterBase } from "./entity-drone-shooter-base";
import type { GraphicsManager } from "../../graphics-manager.js";

export class EntityDroneLaser extends EntityDroneShooterBase {
	laserDuration: number;
	laserTimer: number;
	laserDirection: Vector2;
	laserHitPosition: Vector2;
	laserHitNormal: Vector2;

	constructor(
		entityGrid: GridEntity,
		position: Vector2,
		facingDirection: number,
		moveType: number
	) {
		const speed = 12 * (1 / 14) * 0.5 * (40 / SimulationRate);
		const preFireDelay = 30 * (SimulationRate / 40);
		const postFireDelay = 40 * (SimulationRate / 40);
		super(
			entityGrid,
			position,
			speed,
			facingDirection,
			moveType,
			preFireDelay,
			postFireDelay
		);
		this.laserDuration = 80;
		this.laserTimer = 0;
		this.laserDirection = new Vector2();
		this.laserHitPosition = new Vector2();
		this.laserHitNormal = new Vector2();
	}

	startPrefiring(simulator: Simulator, param2: Vector2): void {
		this.laserDirection.x = param2.x - this.position.x;
		this.laserDirection.y = param2.y - this.position.y;
		this.laserDirection.normalize();
		simulator.segGrid.getRaycastDistance(
			this.position.x,
			this.position.y,
			this.laserDirection.x,
			this.laserDirection.y,
			this.laserHitPosition,
			this.laserHitNormal
		);
	}

	updatePrefiring(simulator: Simulator, param2: Vector2): void {
		simulator.segGrid.getRaycastDistance(
			this.position.x,
			this.position.y,
			this.laserDirection.x,
			this.laserDirection.y,
			this.laserHitPosition,
			this.laserHitNormal
		);
		// simulator.HACKY_GetParticleManager().Spawn_LaserCharge(pos);
	}

	startFiring(simulator: Simulator, param2: Vector2, param3: Vector2): void {
		this.laserTimer = 0;
	}

	updateFiring(simulator: Simulator): boolean {
		const rayDistance = simulator.segGrid.getRaycastDistance(
			this.position.x,
			this.position.y,
			this.laserDirection.x,
			this.laserDirection.y,
			this.laserHitPosition,
			this.laserHitNormal
		);
		// simulator.HACKY_GetParticleManager().Spawn_LaserCharge(this.position);
		for (const player of simulator.playerList) {
			if (!player.isDead()) {
				if (
					overlapCircleVsSegment(
						player.getPosition(),
						player.getRadius(),
						this.position,
						this.laserHitPosition,
						rayDistance
					)
				) {
					const dx = player.getPosition().x - this.position.x;
					const dy = player.getPosition().y - this.position.y;
					const _loc6_ =
						this.laserDirection.x * dx + this.laserDirection.y * dy;
					const hitPositionX = this.position.x + _loc6_ * this.laserDirection.x;
					const hitPositionY = this.position.y + _loc6_ * this.laserDirection.y;
					simulator.killPlayer(
						player,
						PlayerKillType.LASER,
						hitPositionX,
						hitPositionY,
						this.laserDirection.x * 6,
						this.laserDirection.y * 6
					);
				}
			}
		}

		++this.laserTimer;
		if (this.laserDuration <= this.laserTimer) {
			return true;
		}
		return false;
	}

	startPostfiring(simulator: Simulator): void {}

	public generateGraphicComponent(): EntityGraphics | null {
		// return new EntityGraphics_Drone_Laser(this);
		return null;
	}

	// public function GFX_UpdateState(param1:EntityGraphics_Drone_Laser) : void
	// {
	// 	 param1.pos.x = pos.x;
	// 	 param1.pos.y = pos.y;
	// 	 param1.orn = gfxorn;
	// 	 var _loc2_:int = GetFiringState();
	// 	 if(_loc2_ == FIRING_STATE_IDLE)
	// 	 {
	// 			param1.anim = EntityGraphics_Drone_Laser.ANIM_MOVE;
	// 	 }
	// 	 else if(_loc2_ == FIRING_STATE_PREFIRING)
	// 	 {
	// 			param1.anim = EntityGraphics_Drone_Laser.ANIM_PREFIRE;
	// 			param1.blast_pos.x = this.laser_hit_pos.x;
	// 			param1.blast_pos.y = this.laser_hit_pos.y;
	// 	 }
	// 	 else if(_loc2_ == FIRING_STATE_POSTFIRING)
	// 	 {
	// 			param1.anim = EntityGraphics_Drone_Laser.ANIM_POSTFIRE;
	// 	 }
	// 	 else if(_loc2_ == FIRING_STATE_FIRING)
	// 	 {
	// 			param1.anim = EntityGraphics_Drone_Laser.ANIM_FIRING;
	// 			param1.blast_scale = 30 + 200 * (this.laser_timer / this.laser_duration);
	// 	 }
	// }

	debugDraw(gfx: GraphicsManager): void {
		// super.Debug_Draw(param1);
		// param1.SetStyle(4, 8921634, 50);
		// param1.DrawCircle(pos.x, pos.y, r / 2);
		// const _loc2_: int = GetFiringState();
		// if (_loc2_ == FIRING_STATE_PREFIRING) {
		// 	param1.SetStyle(0, 8921634, 20);
		// 	param1.DrawLine(pos.x, pos.y, this.laser_hit_pos.x, this.laser_hit_pos.y);
		// 	param1.DrawLine(
		// 		this.laser_hit_pos.x,
		// 		this.laser_hit_pos.y,
		// 		this.laser_hit_pos.x + this.laser_hit_n.x * 4,
		// 		this.laser_hit_pos.y + this.laser_hit_n.y * 4
		// 	);
		// } else if (_loc2_ == FIRING_STATE_FIRING) {
		// 	param1.SetStyle(2, 8921634, 80);
		// 	param1.DrawLine(pos.x, pos.y, this.laser_hit_pos.x, this.laser_hit_pos.y);
		// 	param1.DrawLine(
		// 		this.laser_hit_pos.x,
		// 		this.laser_hit_pos.y,
		// 		this.laser_hit_pos.x + this.laser_hit_n.x * 4,
		// 		this.laser_hit_pos.y + this.laser_hit_n.y * 4
		// 	);
		// }
	}
}
