export class CollisionResultLogical {
	vectorX: number;
	vectorY: number;

	constructor() {
		this.vectorX = 0;
		this.vectorY = 0;
	}

	clear(): void {
		this.vectorX = 0;
		this.vectorY = 0;
	}
}
