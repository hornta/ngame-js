import type { CollisionResultLogical } from "./collision-result-logical";
import type { CollisionResultPhysical } from "./collision-result-physical";
import type { EntityBase } from "./entities/entity-base";
import { Ragdoll } from "./ragdoll";
import { PlayerKillType, SimulationRate } from "./simulator";
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
	// ninjaGfx: EntityGraphicsNinja,
	crushThreshold: number;
	crushVector: Vector2;
	crushDistance: number;
	crushFlag: boolean;
	deathType: number;
	deathPosition: Vector2;
	deathForce: Vector2;
	tmpNearPosition: Vector2;
	entityList: EntityBase[];
	segmentList: Segment[];
	segmentClosestPoint: Vector2;
	wallListX: number[];
	wallListY: number[];
	resultLogical: CollisionResultLogical;
	resultPhysical: CollisionResultPhysical;
	closestPoint: Vector2;
	tempV: Vector2;
	tempP: Vector2;
	publicPosition: Vector2;
	publicVelocity: Vector2;
	gfxColor: number;

	constructor(playerId: number, x: number, y: number) {
		this.playerId = playerId;
		this.position = new Vector2(x, y);
		this.velocity = new Vector2(0, 0);
		this.oldPosition = new Vector2(0, 0);
		this.r = 10;
		this.impulseScale = 40 / SimulationRate;
		this.maxSpeedAir = this.r * 0.5 * (40 / SimulationRate);
		this.maxSpeedGround = this.r * 0.5 * (40 / SimulationRate);
		this.groundAccel = 0.15 * (40 / SimulationRate) * (40 / SimulationRate);
		this.airAccel = 0.1 * (40 / SimulationRate) * (40 / SimulationRate);
		this.normGrav = 0.15 * (40 / SimulationRate) * (40 / SimulationRate);
		this.jumpGrav = 0.025 * (40 / SimulationRate) * (40 / SimulationRate);
		this.normDrag = Math.pow(0.99, 40 / SimulationRate);
		this.winDrag = Math.pow(0.8, 40 / SimulationRate);
		this.wallFriction = Math.pow(0.87, 40 / SimulationRate);
		this.skidFriction = Math.pow(0.92, 40 / SimulationRate);
		this.standFriction = Math.pow(0.8, 40 / SimulationRate);
		this.g = this.normGrav;
		this.d = this.normDrag;
		this.currentState = PlayerState.STATE_DISABLED;
		this.facingDirection = 1;
		this.jumpAmount = 1;
		this.jumpYBias = 2;
		this.maxJumpTime = 30 * (SimulationRate / 40);
		this.terminalVelocity = this.r * 0.9 * (40 / SimulationRate);
		this.jumpTimer = 0;
		this.wasJumpHeld = false;
		this.wasInAir = false;
		this.oldV = new Vector2(0, 0);
		this.inAir = false;
		this.nearWall = false;
		this.wallN = new Vector2(0, 0);
		this.floorN = new Vector2(0, -1);
		this.fCount = 1;
		this.fVector = new Vector2();
		this.raggy = new Ragdoll();
		// this.ninja_gfx = null;
		this.crushThreshold = 0.05;
		this.crushVector = new Vector2();
		this.crushDistance = 0;
		this.crushFlag = false;
		this.deathType = PlayerKillType.TIME;
		this.deathPosition = new Vector2();
		this.deathForce = new Vector2();
		this.tmpNearPosition = new Vector2();
		this.entityList = [];
		this.segmentList = [];
		this.segmentClosestPoint = new Vector2();
		this.wallListX = [];
		this.wallListY = [];
		this.resultLogical = new CollisionResultLogical();
		this.resultPhysical = new CollisionResultPhysical();
		this.closestPoint = new Vector2();
		this.tempV = new Vector2();
		this.tempP = new Vector2();
		this.publicPosition = new Vector2();
		this.publicVelocity = new Vector2();
	}

	isDead(): boolean {
		return (
			this.currentState === PlayerState.STATE_DEAD ||
			this.currentState === PlayerState.STATE_DISABLED
		);
	}

	getPosition(): Vector2 {
		this.publicPosition.setFrom(this.position);
		return this.publicPosition;
	}

	getVelocity(): Vector2 {
		this.publicVelocity.setFrom(this.velocity);
		return this.publicVelocity;
	}

	getRadius(): number {
		return this.r;
	}

	kill(
		type: PlayerKillType,
		x: number,
		y: number,
		forceX: number,
		forceY: number
	): void {
		if (
			this.currentState === PlayerState.STATE_AWAITINGDEATH ||
			this.currentState === PlayerState.STATE_DISABLED
		) {
			return;
		}
		this.deathType = type;
		this.deathPosition.x = x;
		this.deathPosition.y = y;
		this.deathForce.x = forceX;
		this.deathForce.y = forceY;
		this.exitCurrentState();
		this.currentState = PlayerState.STATE_AWAITINGDEATH;
	}

	win() {
		if (
			this.currentState === PlayerState.STATE_DISABLED ||
			this.currentState === PlayerState.STATE_CELEBRATING ||
			this.currentState === PlayerState.STATE_AWAITINGDEATH ||
			this.currentState === PlayerState.STATE_DEAD
		) {
			return false;
		}
		this.exitCurrentState();
		this.currentState = PlayerState.STATE_CELEBRATING;
		return true;
	}

	exitCurrentState(): void {
		if (this.currentState === PlayerState.STATE_DEAD) {
			throw new Error(
				`exitCurrentState() was called on a dead player!: ${this.playerId}`
			);
		}
		if (this.currentState === PlayerState.STATE_JUMPING) {
			this.g = this.normGrav;
		}
	}
}
