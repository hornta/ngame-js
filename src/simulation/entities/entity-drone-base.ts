import type { GridEntity } from "../grid-entity";
import type { Vector2 } from "../vector2";

export class EntityDroneBase extends EntityBase {
	position: Vector2;
	speed: number;
	radius: number;
	stepSize: number;
	nextGoal: Vector2;
	facingDirection: number;
	moveType: number;

	constructor(
		entityGrid: GridEntity,
		x: number,
		y: number,
		speed: number,
		facingDirection: number,
		moveType: number
	) {
		this.position = new Vector2(x, y);
		this.radius = 12 * (3 / 4);
		this.speed = speed;
		this.nextGoal = this.position.clone();
		this.facingDirection = facingDirection;
		this.moveType = moveType;
		entityGrid.addEntity(this.pos);
	}
}
