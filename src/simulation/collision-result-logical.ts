export class CollisionResultLogical {
	vectorX: number;
	vectorY: number;

	constructor() {
		this.clear();
	}

	clear(): void {
		this.vectorX = 0;
		this.vectorY = 0;
	}
}
