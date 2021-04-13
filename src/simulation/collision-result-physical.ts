export class CollisionResultPhysical {
	pen: number;
	nx: number;
	ny: number;
	isHardCollision: boolean;

	constructor() {
		this.pen = 0;
		this.nx = 0;
		this.ny = 0;
		this.isHardCollision = false;
	}

	clear(): void {
		this.pen = 0;
		this.nx = 0;
		this.ny = 0;
		this.isHardCollision = false;
	}
}
