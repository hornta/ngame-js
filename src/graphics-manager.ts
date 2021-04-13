import type { EntityGraphics } from "./entity-graphics.js";
import type { EntityGraphicsNinja } from "./graphics/entity-graphics-ninja.js";

class TileGraphic {
	render() {}
}

export class GraphicsManager {
	private entityGFXList: EntityGraphics[];
	private playerGFXList: EntityGraphicsNinja[];

	private tileCanvas: HTMLCanvasElement;

	render(): void {
		for (const entity of this.entityGFXList) {
			entity.updateState();
		}

		for (const player of this.playerGFXList) {
			player.updateState();
		}
	}
}
