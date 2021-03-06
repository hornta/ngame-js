import type { EntityGraphics } from "../../graphics/entity-graphics.js";
import { overlapCircleVsCircle } from "../../fns";
import type { CollisionResultLogical } from "../collision-result-logical";
import type { GridEntity } from "../grid-entity";
import type { Ninja } from "../ninja";
import type { Simulator } from "../simulator";
import type { Vector2 } from "../vector2.js";
import { EntityBase } from "./entity-base";
import type { EntityExitDoor } from "./entity-exit-door";
import type { GraphicsManager } from "../../graphics-manager.js";

export class EntityExitSwitch extends EntityBase {
	radius: number;
	door: EntityExitDoor;

	constructor(entityGrid: GridEntity, position: Vector2, door: EntityExitDoor) {
		super(position);
		this.radius = 12 * 0.5;
		this.door = door;
		entityGrid.addEntity(this.position, this);
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
				this.door.switchOpenTheExit(simulator.entityGrid);
				simulator.entityGrid.removeEntity(this);
			}
		}
		return false;
	}

	move(simulator: Simulator): void {}

	generateGraphicComponent(): EntityGraphics | null {
		return null;
	}

	debugDraw(gfx: GraphicsManager): void {}
}
