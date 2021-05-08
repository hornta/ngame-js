import type { GraphicsManager } from "../graphics-manager.js";
import type { EntityBounceBlock } from "../simulation/entities/entity-bounce-block.js";
import { Vector2 } from "../simulation/vector2.js";
import type { EntityGraphics } from "./entity-graphics.js";

export class EntityGraphicsBounceBlock implements EntityGraphics {
	private entity: EntityBounceBlock;

	constructor(entity: EntityBounceBlock) {
		this.entity = entity;
		this.position = new Vector2();
	}

	render(gfx: GraphicsManager): void {
		gfx.setStyle("#666", 1);
		gfx.getContext().fillStyle = "#ccc";
		gfx.renderSquare(this.entity);
	}
}
