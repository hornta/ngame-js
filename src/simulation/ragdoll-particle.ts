import { Vector2 } from "./vector2.js";

export class RagdollParticle {
	position: Vector2;
	velocity: Vector2;
	solverPosition: Vector2;
	radius: number;
	d: number;

	constructor(r: number, d: number) {
		this.position = new Vector2();
		this.velocity = new Vector2();
		this.solverPosition = new Vector2();
		this.radius = r;
		this.d = d;
	}

	public preIntegrate(gravity: number): void {
		this.velocity.x *= this.d;
		this.velocity.y *= this.d;
		this.velocity.y += gravity;
		this.solverPosition.x = this.position.x + this.velocity.x;
		this.solverPosition.y = this.position.y + this.velocity.y;
	}

	public postIntegrate(): void {
		this.velocity.x = this.solverPosition.x - this.position.x;
		this.velocity.y = this.solverPosition.y - this.position.y;
		this.position.x = this.solverPosition.x;
		this.position.y = this.solverPosition.y;
	}

	public copyState(particle: RagdollParticle): void {
		this.position.setFrom(particle.position);
		this.velocity.setFrom(particle.velocity);
	}

	public setState(
		posX: number,
		posY: number,
		velX: number,
		velY: number
	): void {
		this.position.x = posX;
		this.position.y = posY;
		this.velocity.x = velX;
		this.velocity.y = velY;
	}
}
