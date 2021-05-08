import type { GraphicsManager } from "../graphics-manager.js";
import type { EntityGraphics } from "./entity-graphics.js";

export class EntityGraphicsNinja implements EntityGraphics {
	render(gfx: GraphicsManager): void {}
	updateState(): void {}
}
