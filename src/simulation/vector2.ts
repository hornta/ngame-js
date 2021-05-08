export class Vector2 {
	public x: number;
	public y: number;

	public constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	public clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	public to(other: Vector2): Vector2 {
		return new Vector2(other.x - this.x, other.y - this.y);
	}

	public setFrom(vector: Vector2): void {
		this.x = vector.x;
		this.y = vector.y;
	}

	public toString(): string {
		return `(${this.x}, ${this.y})`;
	}

	public normalize(): void {
		const length = Math.sqrt(this.x * this.x + this.y * this.y);
		if (length !== 0) {
			this.x /= length;
			this.y /= length;
		}
	}

	public length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	public lengthSquared(): number {
		return this.x * this.x + this.y * this.y;
	}

	public dot(vector: Vector2): number {
		return this.x * vector.x + this.y * vector.y;
	}

	public perp(): Vector2 {
		return new Vector2(-this.y, this.x);
	}

	public scale(scalar: number): void {
		this.x *= scalar;
		this.y *= scalar;
	}

	public plus(vector: Vector2): Vector2 {
		return new Vector2(this.x + vector.x, this.y + vector.y);
	}

	public minus(vector: Vector2): Vector2 {
		return new Vector2(this.x - vector.x, this.y - vector.y);
	}
}
