import type { GraphicsManager } from "../graphics-manager.js";

export interface EntityGraphics {
	render(gfx: GraphicsManager): void;

	updateState(): void;
}
