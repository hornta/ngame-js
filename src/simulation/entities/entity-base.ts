import type { EntityGraphics } from "../../entity-graphics.js";
import type { CollisionResultLogical } from "../collision-result-logical";
import type { CollisionResultPhysical } from "../collision-result-physical";
import type { Ninja } from "../ninja";
import type { Simulator } from "../simulator";
import type { Vector2 } from "../vector2";

export abstract class EntityBase {
	private id: number;
	private gridIndex: number;

	constructor() {
		this.id = -1;
		this.gridIndex = -1;
	}

	setId(id: number): void {
		this.id = id;
	}

	getId(): number {
		return this.id;
	}

	getGridIndex(): number {
		return this.gridIndex;
	}

	setGridIndex(index: number): void {
		this.gridIndex = index;
	}

	collideVsCirclePhysical(
		collision: CollisionResultPhysical,
		param2: Vector2,
		param3: Vector2,
		param4: Vector2,
		param5: number
	): boolean {
		return false;
	}

	collideVsCircleLogical(
		simulator: Simulator,
		ninja: Ninja | null,
		collision: CollisionResultLogical,
		param4: Vector2,
		param5: Vector2,
		param6: Vector2,
		param7: number,
		param8: number
	): boolean {
		return false;
	}

	think(simulator: Simulator): void {}
	move(simulator: Simulator): void {}
	generateGraphicComponent(): EntityGraphics | null {
		return null;
	}
	abstract debugDraw(context: CanvasRenderingContext2D): void;
}
