import { Vector2 } from "./vector2";

export class AABB {
	min: Vector2;
	max: Vector2;

	constructor(x1: number, y1: number, x2: number, y2: number) {
		this.min = new Vector2(x1, y1);
		this.max = new Vector2(x2, y2);
	}
}
