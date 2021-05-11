import type { EntityGraphics } from "../../graphics/entity-graphics.js";
import { overlapCircleVsCircle } from "../../fns";
import type { CollisionResultLogical } from "../collision-result-logical";
import type { GridEntity } from "../grid-entity";
import type { Ninja } from "../ninja";
import { PlayerKillType, SimulationRate, Simulator } from "../simulator";
import type { Vector2 } from "../vector2";
import { EntityDroneBase } from "./entity-drone-base";
import type { GraphicsManager } from "../../graphics-manager.js";

export class EntityDroneZap extends EntityDroneBase {
	constructor(
		entityGrid: GridEntity,
		position: Vector2,
		facingDirection: number,
		moveType: number
	) {
		const speed = 12 * (1 / 14) * 2 * (40 / SimulationRate);
		super(entityGrid, position, speed, facingDirection, moveType);
	}

	collideVsNinjaLogical(
		simulator: Simulator,
		ninja: Ninja,
		collision: CollisionResultLogical,
		position: Vector2,
		param5: Vector2,
		param6: Vector2,
		radius: number
	): boolean {
		if (overlapCircleVsCircle(this.position, this.radius, position, radius)) {
			let _loc9_ = position.x - this.position.x;
			let _loc10_ = position.y - this.position.y;
			const _loc11_ = Math.sqrt(_loc9_ * _loc9_ + _loc10_ * _loc10_);
			_loc9_ /= _loc11_;
			_loc10_ /= _loc11_;
			// param1
			// 	.HACKY_GetParticleManager()
			// 	.Spawn_Zap(
			// 		pos.x + _loc9_ * r,
			// 		pos.y + _loc10_ * r,
			// 		(Math.atan2(_loc10_, _loc9_) / Math.PI) * 180
			// 	);
			if (ninja === null) {
				collision.vectorX = _loc9_ * 12;
				collision.vectorY = _loc10_ * 12 - 4;
				return true;
			}
			simulator.killPlayer(
				ninja,
				PlayerKillType.ZAP,
				position.x - _loc9_ * radius,
				position.y - _loc10_ * radius,
				_loc9_ * 12,
				_loc10_ * 12 - 4
			);
		}
		return false;
	}

	generateGraphicComponent(): EntityGraphics | null {
		// return new EntityGraphics_Drone_Zap(this);
		return null;
	}

	// GFX_UpdateState(param1: EntityGraphics): void {
	// 	const _loc2_: EntityGraphics_Drone_Zap = param1;
	// 	_loc2_.pos.x = pos.x;
	// 	_loc2_.pos.y = pos.y;
	// 	_loc2_.orn = gfxorn;
	// }

	debugDraw(gfx: GraphicsManager): void {
		// super.Debug_Draw(param1);
		// param1.SetStyle(4, 8947967, 50);
		// param1.DrawCircle(pos.x, pos.y, r / 2);
	}
}
