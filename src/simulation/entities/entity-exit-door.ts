import { EntityBase } from "./entity-base";

export class EntityBounceBlock extends EntityBase {
	constructor() {}

	collideVsCirclePhysical(
		collision: CollisionResultPhysical,
		param2: vec2,
		param3: vec2,
		param4: vec2,
		param5: number
	): boolean {
		return false;
	}

	collideVsCircleLogical(
		simulator: Simulator,
		ninja: Ninja,
		collision: CollisionResultLogical,
		param4: vec2,
		param5: vec2,
		param6: vec2,
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
