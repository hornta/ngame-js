import type { App } from "./app";
import { Ticker } from "@pixi/ticker";

export class Controller {
	app: App;
	ticker: Ticker;

	constructor() {
		app = new App();
		ticker = new Ticker();
	}

	tick() {
		this.app.tick();
	}
}
