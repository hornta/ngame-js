import { tryToAcquireTarget } from "../../fns";
import type { GraphicsManager } from "../../graphics-manager.js";
import type { GridEntity } from "../grid-entity";
import type { Simulator } from "../simulator";
import type { Vector2 } from "../vector2";
import { EntityDroneBase } from "./entity-drone-base";

enum FiringState {
	IDLE = 0,
	PREFIRING = 1,
	FIRING = 2,
	POSTFIRING = 3,
}

export abstract class EntityDroneShooterBase extends EntityDroneBase {
	preFireDelay: number;
	postFireDelay: number;
	firingTimer: number;
	currentFiringState: FiringState;
	targetIndex: number;

	constructor(
		entityGrid: GridEntity,
		position: Vector2,
		speed: number,
		facingDirection: number,
		moveType: number,
		preFireDelay: number,
		postFireDelay: number
	) {
		super(entityGrid, position, speed, facingDirection, moveType);
		this.currentFiringState = FiringState.IDLE;
		this.firingTimer = 0;
		this.preFireDelay = preFireDelay;
		this.postFireDelay = postFireDelay;
		this.targetIndex = -1;
	}

	move(simulator: Simulator): void {
		if (this.currentFiringState === FiringState.IDLE) {
			super.move(simulator);
		}
	}

	getFiringState(): FiringState {
		return this.currentFiringState;
	}

	think(simulator: Simulator): void {
		if (this.currentFiringState === FiringState.IDLE) {
			const playerIndex = tryToAcquireTarget(
				this.position,
				simulator.playerList,
				simulator.segGrid
			);
			if (playerIndex >= 0) {
				this.internalStartPrefiring(
					simulator,
					playerIndex,
					simulator.playerList[playerIndex].getPosition()
				);
			}
		} else {
			if (this.targetIndex < 0) {
				throw new Error(
					`EntityDroneShooterBase.think() isn't idle, but has an invalid target index!: ${this.targetIndex}`
				);
				return;
			}
			if (this.currentFiringState === FiringState.PREFIRING) {
				if (simulator.playerList[this.targetIndex].isDead()) {
					this.internalStartPostfiring(simulator);
				} else {
					this.updatePrefiring(
						simulator,
						simulator.playerList[this.targetIndex].getPosition()
					);
					++this.firingTimer;
					if (this.preFireDelay <= this.firingTimer) {
						this.internalStartFiring(
							simulator,
							simulator.playerList[this.targetIndex].getPosition(),
							simulator.playerList[this.targetIndex].getVelocity()
						);
					}
				}
			} else if (this.currentFiringState === FiringState.FIRING) {
				if (this.updateFiring(simulator)) {
					this.internalStartPostfiring(simulator);
				}
			} else if (this.currentFiringState === FiringState.POSTFIRING) {
				++this.firingTimer;
				if (this.postFireDelay <= this.firingTimer) {
					for (
						let playerIndex = 0;
						playerIndex < simulator.playerList.length;
						++playerIndex
					) {
						const player = simulator.playerList[playerIndex];
						if (!player.isDead()) {
							if (
								simulator.segGrid.raycastVsPlayer(
									this.position,
									player.getPosition(),
									player.getRadius()
								)
							) {
								this.internalStartPrefiring(
									simulator,
									playerIndex,
									player.getPosition()
								);
								return;
							}
						}
					}

					this.internalStartIdling();
				}
			}
		}
	}

	internalStartPrefiring(
		simulator: Simulator,
		playerIndex: number,
		position: Vector2
	): void {
		this.firingTimer = 0;
		this.currentFiringState = FiringState.PREFIRING;
		this.targetIndex = playerIndex;
		this.startPrefiring(simulator, position);
	}

	internalStartFiring(
		simulator: Simulator,
		position: Vector2,
		velocity: Vector2
	): void {
		this.currentFiringState = FiringState.FIRING;
		this.startFiring(simulator, position, velocity);
	}

	internalStartPostfiring(simulator: Simulator): void {
		this.firingTimer = 0;
		this.currentFiringState = FiringState.POSTFIRING;
		this.startPostfiring(simulator);
	}

	internalStartIdling(): void {
		this.currentFiringState = FiringState.IDLE;
		this.targetIndex = -1;
	}

	startPrefiring(simulator: Simulator, param2: Vector2): void {}
	updatePrefiring(simulator: Simulator, param2: Vector2): void {}
	startFiring(simulator: Simulator, param2: Vector2, param3: Vector2): void {}
	updateFiring(simulator: Simulator): boolean {
		return false;
	}
	startPostfiring(simulator: Simulator): void {}

	debugDraw(gfx: GraphicsManager): void {
		// let _loc2_ = NaN;
		// let _loc3_ = NaN;
		// super.Debug_Draw(param1);
		// param1.SetStyle(0, 0, 100);
		// if (this.CUR_FIRING_STATE == FIRING_STATE_PREFIRING) {
		// 	_loc2_ = Number(this.firing_timer) / Number(this.prefire_delay);
		// 	param1.DrawSquare(pos.x, pos.y, r * _loc2_);
		// } else if (this.CUR_FIRING_STATE == FIRING_STATE_POSTFIRING) {
		// 	_loc3_ = 1 - Number(this.firing_timer) / Number(this.postfire_delay);
		// 	param1.DrawSquare(pos.x, pos.y, r * _loc3_);
		// }
	}
}
