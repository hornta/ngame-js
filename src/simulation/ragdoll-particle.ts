import type { Vector2 } from "./vector2";

export class RagdollParticle {
	position: Vector2;
	velocity: Vector2;
	solverPosition: Vector2;
	r: number;
	d: number;

	constructor(r: number, d: number) {
		this.position = new Vector2();
		this.velocity = new Vector2();
		this.solverPosition = new Vector2();
		this.r = r;
		this.d = d;
	}
}
