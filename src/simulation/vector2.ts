export class Vector2 {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	setFrom(vector: Vector2): void {
		this.x = vector.x;
		this.y = vector.y;
	}

	toString(): string {
		return `(${this.x}, ${this.y})`;
	}
}
