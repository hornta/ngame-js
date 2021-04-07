import type { CollisionResultLogical } from "../collision-result-logical";
import type { CollisionResultPhysical } from "../collision-result-physical";
import type { Ninja } from "../ninja";
import type { Simulator } from "../simulator";
import type { Vector2 } from "../vector2";

export abstract class EntityBase {
	private id: number;
	gridIndex: number;

	constructor() {
		id = -1;
		gridIndex = -1;
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

	abstract collideVsCirclePhysical(
		collision: CollisionResultPhysical,
		param2: Vector2,
		param3: Vector2,
		param4: Vector2,
		param5: number
	): boolean;

	abstract collideVsCircleLogical(
		simulator: Simulator,
		ninja: Ninja,
		collision: CollisionResultLogical,
		param4: Vector2,
		param5: Vector2,
		param6: Vector2,
		param7: number,
		param8: number
	): boolean;

	abstract think(simulator: Simulator): void;
	abstract move(simulator: Simulator): void;
	abstract generateGraphicComponent(): EntityGraphics;
	abstract debugDraw(context: CanvasRenderingContext2D): void;
}
