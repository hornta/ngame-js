import type { EntityGraphics } from "../../graphics/entity-graphics.js";
import { overlapCircleVsCircle } from "../../fns";
import type { CollisionResultLogical } from "../collision-result-logical";
import type { GridEntity } from "../grid-entity";
import type { Ninja } from "../ninja.js";
import type { Simulator } from "../simulator";
import type { Vector2 } from "../vector2.js";
import { EntityBase } from "./entity-base";
import type { GraphicsManager } from "../../graphics-manager.js";

export class EntityExitDoor extends EntityBase {
	radius: number;
	isOpen: boolean;

	constructor(position: Vector2) {
		super(position);
		this.radius = 12;
		this.isOpen = false;
	}

	collideVsNinjaLogical(
		simulator: Simulator,
		player: Ninja,
		param3: CollisionResultLogical,
		otherPosition: Vector2,
		param5: Vector2,
		param6: Vector2,
		otherRadius: number,
		param8: number
	): boolean {
		if (player !== null) {
			if (
				overlapCircleVsCircle(
					this.position,
					this.radius,
					otherPosition,
					otherRadius
				)
			) {
				simulator.exitPlayer();
			}
		}
		return false;
	}

	switchOpenTheExit(entityGrid: GridEntity): void {
		this.isOpen = true;
		entityGrid.addEntity(this.position, this);
	}

	switchIsOpen(): boolean {
		return this.isOpen;
	}

	public generateGraphicComponent(): EntityGraphics | null {
		// return new EntityGraphics_ExitDoor(this, this.pos.x, this.pos.y);
		return null;
	}

	// public GFX_UpdateState(param1: EntityGraphics_ExitDoor): void {
	// 	if (this.isOpen) {
	// 		param1.anim = EntityGraphics_ExitDoor.ANIM_OPEN;
	// 	} else {
	// 		param1.anim = EntityGraphics_ExitDoor.ANIM_CLOSED;
	// 	}
	// }

	public debugDraw(gfx: GraphicsManager): void {
		// if (this.isOpen) {
		// 	param1.SetStyle(0, 0, 100);
		// 	param1.DrawSquare(this.pos.x, this.pos.y, this.r);
		// 	param1.DrawSquare(this.pos.x, this.pos.y, this.r - 2);
		// } else {
		// 	param1.SetStyle(0, 0, 30);
		// 	param1.DrawCross(this.pos.x, this.pos.y, this.r);
		// 	param1.DrawSquare(this.pos.x, this.pos.y, this.r);
		// }
	}
}
