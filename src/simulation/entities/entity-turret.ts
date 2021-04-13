import type { EntityGraphics } from "../../entity-graphics.js";
import { overlapCircleVsSegment, tryToAcquireTarget } from "../../fns.js";
import type { GridEntity } from "../grid-entity.js";
import { PlayerKillType, SimulationRate, Simulator } from "../simulator.js";
import { Vector2 } from "../vector2.js";
import { EntityBase } from "./entity-base";

enum TurretState {
	IDLE = 0,
	TARGETING = 1,
	PREFIRE = 2,
	POSTFIRE = 3,
}

export class EntityTurret extends EntityBase {
	private threshold2: number[];
	private aimSpeed: number[];
	private timerStep: number[];
	private predictionScale: number;
	private position: Vector2;
	private aimPosition: Vector2;
	private aimRegion: number;
	private shotTimer: number;
	private currentState: TurretState;
	private targetIndex: number;
	private gfxTriggerEvent: boolean;
	private drawTimer: number;
	private hitPosition: Vector2;
	private hitNormal: Vector2;
	private timerFiretime: number;
	private prefireDelay: number;
	private postfireDelay: number;

	constructor(x: number, y: number) {
		super();
		this.timerFiretime = 60 * (SimulationRate / 40);
		this.prefireDelay = 10 * (SimulationRate / 40);
		this.postfireDelay = 10 * (SimulationRate / 40);
		this.threshold2 = [9216, 1764, 576];
		this.aimSpeed = [
			0.03 * (40 / SimulationRate),
			0.035 * (40 / SimulationRate),
			0.05 * (40 / SimulationRate),
			0.05 * (40 / SimulationRate),
		];
		this.timerStep = [0, 0.5, 1.5, 3.5];
		this.predictionScale = SimulationRate / 40;
		this.position = new Vector2(x, y);
		this.aimPosition = new Vector2(x, y);
		this.aimRegion = 0;
		this.shotTimer = 0;
		this.currentState = TurretState.IDLE;
		this.targetIndex = -1;
		this.gfxTriggerEvent = false;
		this.drawTimer = 0;
		this.hitPosition = new Vector2();
		this.hitNormal = new Vector2();
	}

	think(simulator: Simulator): void {
		if (this.currentState === TurretState.IDLE) {
			const playerIndex = tryToAcquireTarget(
				this.position,
				simulator.playerList,
				simulator.segGrid
			);

			if (playerIndex >= 0) {
				this.startTargeting(playerIndex);
			}
		} else {
			if (this.targetIndex < 0) {
				throw new Error(
					`EntityTurret.think() isn't idle, but has an invalid target index!: ${this.targetIndex}`
				);
			}
			if (this.currentState === TurretState.TARGETING) {
				if (!this.isCurrentTargetVisible(simulator)) {
					this.startIdling();
				} else {
					this.updateAim(
						simulator.playerList[this.targetIndex].getPosition(),
						simulator.playerList[this.targetIndex].getVelocity()
					);
					if (this.timerFiretime < this.shotTimer) {
						this.startFiring();
					}
				}
			} else if (this.currentState === TurretState.PREFIRE) {
				++this.shotTimer;
				if (this.prefireDelay <= this.shotTimer) {
					if (!simulator.playerList[this.targetIndex].isDead()) {
						let _loc3_ = this.aimPosition.x - this.position.x;
						let _loc4_ = this.aimPosition.y - this.position.y;
						const _loc5_ = Math.sqrt(_loc3_ * _loc3_ + _loc4_ * _loc4_);
						_loc3_ /= _loc5_;
						_loc4_ /= _loc5_;
						const _loc6_ = simulator.segGrid.getRaycastDistance(
							this.position.x,
							this.position.y,
							_loc3_,
							_loc4_,
							this.hitPosition,
							this.hitNormal
						);
						for (const player of simulator.playerList) {
							if (!player.isDead()) {
								const playerPosition = player.getPosition();
								const playerRadius = player.getRadius();
								if (
									overlapCircleVsSegment(
										playerPosition,
										playerRadius,
										this.position,
										this.hitPosition,
										_loc6_
									)
								) {
									const _loc10_ = playerPosition.x - this.position.x;
									const _loc11_ = playerPosition.y - this.position.y;
									const _loc12_ = _loc3_ * _loc10_ + _loc4_ * _loc11_;
									this.hitPosition.x = this.position.x + _loc12_ * _loc3_;
									this.hitPosition.y = this.position.y + _loc12_ * _loc4_;
									this.hitNormal.x = 0;
									this.hitNormal.y = 0;
									simulator.killPlayer(
										player,
										PlayerKillType.TURRET,
										this.hitPosition.x,
										this.hitPosition.y,
										_loc3_ * 8,
										_loc4_ * 8
									);
								}
								this.drawTimer = 10;
							}
						}

						// simulator
						// 	.HACKY_GetParticleManager()
						// 	.Spawn_TurretBullet(this.position, this.hitPosition);
						this.gfxTriggerEvent = true;
					}
					this.stopFiring();
				}
			} else if (this.currentState === TurretState.POSTFIRE) {
				++this.shotTimer;
				if (this.postfireDelay <= this.shotTimer) {
					if (this.isCurrentTargetVisible(simulator)) {
						this.resumeTargetting();
					} else {
						this.startIdling();
					}
				}
			}
		}
	}

	generateGraphicComponent(): EntityGraphics | null {
		return null;
	}

	debugDraw(context: CanvasRenderingContext2D): void {}

	private startTargeting(playerIndex: number): void {
		this.aimPosition.setFrom(this.position);
		this.shotTimer = 0;
		this.currentState = TurretState.TARGETING;
		this.targetIndex = playerIndex;
	}

	private startIdling(): void {
		this.currentState = TurretState.IDLE;
		this.targetIndex = -1;
	}

	private startFiring(): void {
		this.shotTimer = 0;
		this.currentState = TurretState.PREFIRE;
	}

	private stopFiring(): void {
		this.shotTimer = 0;
		this.currentState = TurretState.POSTFIRE;
	}

	private resumeTargetting(): void {
		this.shotTimer = 0;
		this.currentState = TurretState.TARGETING;
	}

	private isCurrentTargetVisible(simulator: Simulator): boolean {
		const player = simulator.playerList[this.targetIndex];
		let isVisible = false;
		if (!player.isDead()) {
			isVisible = simulator.segGrid.raycastVsPlayer(
				this.position,
				player.getPosition(),
				player.getRadius()
			);
		}
		return isVisible;
	}

	private updateAim(position: Vector2, velocity: Vector2): void {
		const _loc3_ = velocity.x * this.predictionScale;
		const _loc4_ = velocity.y * this.predictionScale;
		const _loc5_ = position.x + _loc3_;
		const _loc6_ = position.y + _loc4_;
		const _loc7_ = _loc5_ - this.aimPosition.x;
		const _loc8_ = _loc6_ - this.aimPosition.y;
		const _loc9_ = _loc7_ * _loc7_ + _loc8_ * _loc8_;
		this.aimRegion = 0;
		let _loc10_ = 0;
		while (_loc10_ < this.threshold2.length) {
			if (_loc9_ > this.threshold2[_loc10_]) {
				break;
			}
			++this.aimRegion;
			_loc10_++;
		}
		this.shotTimer += this.timerStep[this.aimRegion];
		const _loc11_ = this.aimSpeed[this.aimRegion];
		this.aimPosition.x += _loc11_ * _loc7_;
		this.aimPosition.y += _loc11_ * _loc8_;
	}
}
