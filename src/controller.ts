import { Ticker } from "@pixi/ticker";
import { Game } from "./game";

export class Controller {
	game: Game;
	ticker: Ticker;

	constructor() {
		this.game = new Game();
		this.ticker = new Ticker();
		this.ticker.add(() => {
			this.tick();
		});
		this.ticker.start();
	}

	tick(): void {
		this.game.tick();
	}
}
