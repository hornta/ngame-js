import { overlapCircleVsCircle } from "../../fns.js";
import type { GridEntity } from "../grid-entity.js";
import type { Simulator } from "../simulator.js";
import type { Vector2 } from "../vector2.js";
import { EntityBase } from "./entity-base";

export class EntityGold extends EntityBase {
	private position: Vector2;
	private radius: number;
	private isCollected: boolean;

	constructor(entityGrid: GridEntity, x: number, y: number) {
		super();
		this.position = new Vector2(x, y);
		this.radius = 12 * 0.5;
		this.isCollected = false;
		entityGrid.addEntity(this);
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
		if (ninja !== null) {
			if (overlapCircleVsCircle(this.pos, this.r, param4, param7)) {
				if (simulator.goldHitPlayer(ninja)) {
					this.isCollected = true;
					simulator.entityGrid.removeEntity(this);
					// simulator.HACKY_GetSoundManager().PlaySound_Gold();
				}
			}
		}
		return false;
	}

	generateGraphicComponent(): EntityGraphics {
		// return new EntityGraphics_Gold(this,this.pos.x,this.pos.y);
		return null;
	}

	debugDraw(context: CanvasRenderingContext2D): void {
		// if (this.isCollected) {
		// 	param1.SetStyle(0, 0, 10);
		// } else {
		// 	param1.SetStyle(0, 0, 100);
		// }
		// param1.DrawSquare(this.pos.x, this.pos.y, this.r / 2);
		// param1.DrawCircle(this.pos.x, this.pos.y, this.r);
	}
}
