import type { EntityGraphics } from "../../graphics/entity-graphics.js";
import type { GraphicsManager } from "../../graphics-manager.js";
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

	collideVsNinjaPhysical(
		collision: CollisionResultPhysical,
		position: Vector2,
		velocity: Vector2,
		oldPosition: Vector2,
		radius: number
	): boolean {
		return false;
	}

	collideVsNinjaLogical(
		simulator: Simulator,
		ninja: Ninja | null,
		collision: CollisionResultLogical,
		playerPosition: Vector2,
		playerVelocity: Vector2,
		playerOldPosition: Vector2,
		playerRadius: number,
		param8: number
	): boolean {
		return false;
	}

	think(simulator: Simulator): void {}
	move(simulator: Simulator): void {}
	generateGraphicComponent(): EntityGraphics | null {
		return null;
	}
	abstract debugDraw(gfx: GraphicsManager): void;
}
