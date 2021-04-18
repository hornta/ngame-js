import type { EntityGraphics } from "../../entity-graphics.js";
import { overlapCircleVsCircle } from "../../fns.js";
import type { CollisionResultLogical } from "../collision-result-logical.js";
import type { GridEntity } from "../grid-entity.js";
import type { Ninja } from "../ninja.js";
import { PlayerKillType, Simulator } from "../simulator.js";
import { Vector2 } from "../vector2.js";
import { EntityBase } from "./entity-base";

export class EntityMine extends EntityBase {
	public position: Vector2;
	public radius: number;
	private isExploded: boolean;

	constructor(entityGrid: GridEntity, x: number, y: number) {
		super();
		this.position = new Vector2(x, y);
		this.radius = 12 * (1 / 3);
		this.isExploded = false;
		entityGrid.addEntity(this.position, this);
	}

	collideVsCircleLogical(
		simulator: Simulator,
		ninja: Ninja,
		collision: CollisionResultLogical,
		param4: Vector2,
		param5: Vector2,
		param6: Vector2,
		param7: number,
		param8: number
	): boolean {
		let _loc9_ = NaN;
		let _loc10_ = NaN;
		let _loc11_ = NaN;
		if (overlapCircleVsCircle(this.position, this.radius, param4, param7)) {
			// param1.HACKY_GetParticleManager().Spawn_Explosion(this.position);
			this.isExploded = true;
			simulator.entityGrid.removeEntity(this);
			_loc9_ = param4.x - this.position.x;
			_loc10_ = param4.y - this.position.y;
			_loc11_ = Math.sqrt(_loc9_ * _loc9_ + _loc10_ * _loc10_);
			_loc9_ /= _loc11_;
			_loc10_ /= _loc11_;
			if (ninja === null) {
				collision.vectorX = _loc9_ * 16;
				collision.vectorY = _loc10_ * 16;
				return true;
			}
			simulator.killPlayer(
				ninja,
				PlayerKillType.MINE,
				param4.x - _loc9_ * param7,
				param4.y - _loc10_ * param7,
				_loc9_ * 16,
				_loc10_ * 16
			);
		}
		return false;
	}

	generateGraphicComponent(): EntityGraphics | null {
		// return new EntityGraphics_Mine(this,this.pos.x,this.pos.y);
		return null;
	}

	debugDraw(context: CanvasRenderingContext2D): void {
		// if (this.isExploded) {
		// 	param1.SetStyle(0, 0, 30);
		// } else {
		// 	param1.SetStyle(0, 0, 100);
		// }
		// param1.DrawCross(this.pos.x, this.pos.y, this.r);
		// param1.DrawCircle(this.pos.x, this.pos.y, this.r);
	}
}
