export class Input {
	keys: Record<string, boolean>;
	oldKeys: Record<string, boolean>;
	keyTriggers: Record<string, number>;

	constructor() {
		this.keys = {};
		this.oldKeys = {};
		this.keyTriggers = {};

		const boundHandleKeyDown = this.handleKeyDown.bind(this);
		const boundHandleKeyUp = this.handleKeyUp.bind(this);

		window.addEventListener("keydown", boundHandleKeyDown);
		window.addEventListener("keyup", boundHandleKeyUp);
	}

	handleKeyDown(event: KeyboardEvent): void {
		this.keys[event.code] = true;
	}

	handleKeyUp(event: KeyboardEvent): void {
		this.keys[event.code] = false;
	}

	tick(): void {
		this.keyTriggers = {};

		for (const code of Object.values(this.keys)) {
			if (this.isKeyDown(code)) {
				if (!this.oldKeys[code]) {
					this.keyTriggers[code] = 1;
				}
			} else if (this.oldKeys[code]) {
				this.keyTriggers[code] = -1;
			}
		}

		for (let i = 0; i < this.keys.length; ++i) {
			if (this.isKeyDown(i)) {
				if (!this.oldKeys[i]) {
					this.keyTriggers[i] = 1;
				}
			} else if (this.oldKeys[i]) {
				this.keyTriggers[i] = -1;
			}
		}

		this.oldKeys = { ...this.keys };
	}

	isKeyDown(code: string): boolean {
		return this.keys[code];
	}

	isOnePressed(codes: string[]): boolean {
		for (const code of codes) {
			if (this.keyTriggers[code] > 0) {
				return true;
			}
		}
		return false;
	}

	isKeyPressed(code: string): boolean {
		return this.keyTriggers[code] > 0;
	}
}
