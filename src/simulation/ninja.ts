import type { Vector2 } from "./vector2";

enum PlayerState {
	STATE_STANDING = 0,
	STATE_RUNNING = 1,
	STATE_SKIDDING = 2,
	STATE_JUMPING = 3,
	STATE_FALLING = 4,
	STATE_WALLSLIDING = 5,
	STATE_DEAD = 6,
	STATE_AWAITINGDEATH = 7,
	STATE_CELEBRATING = 8,
	STATE_DISABLED = 9,
}

export class Ninja {
	position: Vector2;
	velocity: Vector2;
	oldPosition: Vector2;
	r: number;
	g: number;
	d: number;
	maxSpeedAir: number;
	maxSpeedGround: number;
	groundAccel: number;
	airAccel: number;
	normGrav: number;
	jumpGrav: number;
	normDrag: number;
	winDrag: number;
	wallFriction: number;
	skidFriction: number;
	standFriction: number;
	currentState: PlayerState;
	facingDirection: number;
	maxJumpTime: number;
	jumpTimer: number;
	jumpAmount: number;
	jumpYBias: number;
	terminalVelocity: number;
	wasJumpHeld: boolean;
	oldV: Vector2;
	wasInAir: boolean;
	inAir: boolean;
	nearWall: boolean;
	wallN: Vector2;
	floorN: Vector2;
	fCount: number;
	fVector: Vector2;
	impulseScale: number;
	playerId: number;
	raggy: Ragdoll;

	constructor() {}
}
