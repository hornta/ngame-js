import { EntityBase } from "./entity-base";

export class EntityGold extends EntityBase {
	constructor() {}

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
		ninja: Ninja,
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

	generateGraphicComponent(): EntityGraphics {
		return null;
	}

	debugDraw(context: CanvasRenderingContext2D): void {}
}
