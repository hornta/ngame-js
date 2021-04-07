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

	normalize(): void {
		const length = Math.sqrt(this.x * this.x + this.y * this.y);
		if (length !== 0) {
			this.x /= length;
			this.y /= length;
		}
	}

	length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
}
