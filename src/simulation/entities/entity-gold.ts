import type { EntityGraphics } from "../../graphics/entity-graphics.js";
import { overlapCircleVsCircle } from "../../fns.js";
import type { CollisionResultLogical } from "../collision-result-logical.js";
import type { GridEntity } from "../grid-entity.js";
import type { Ninja } from "../ninja.js";
import type { Simulator } from "../simulator.js";
import { Vector2 } from "../vector2.js";
import { EntityBase } from "./entity-base";
import type { GraphicsManager } from "../../graphics-manager.js";

export class EntityGold extends EntityBase {
	public position: Vector2;
	private radius: number;
	private isCollected: boolean;

	constructor(entityGrid: GridEntity, x: number, y: number) {
		super();
		this.position = new Vector2(x, y);
		this.radius = 12 * 0.5;
		this.isCollected = false;
		entityGrid.addEntity(this.position, this);
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
		if (ninja !== null) {
			if (overlapCircleVsCircle(this.position, this.radius, param4, param7)) {
				if (simulator.goldHitPlayer(ninja)) {
					this.isCollected = true;
					simulator.entityGrid.removeEntity(this);
					// simulator.HACKY_GetSoundManager().PlaySound_Gold();
				}
			}
		}
		return false;
	}

	generateGraphicComponent(): EntityGraphics | null {
		// return new EntityGraphics_Gold(this,this.pos.x,this.pos.y);
		return null;
	}

	debugDraw(gfx: GraphicsManager): void {
		// if (this.isCollected) {
		// 	param1.SetStyle(0, 0, 10);
		// } else {
		// 	param1.SetStyle(0, 0, 100);
		// }
		// param1.DrawSquare(this.pos.x, this.pos.y, this.r / 2);
		// param1.DrawCircle(this.pos.x, this.pos.y, this.r);
	}
}
