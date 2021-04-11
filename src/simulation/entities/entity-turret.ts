import { tryToAcquireTarget } from "../../fns.js";
import type { GridEntity } from "../grid-entity.js";
import { SimulationRate, Simulator } from "../simulator.js";
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
	private tmpHitPosition: Vector2;
	private tmpHitNormal: Vector2;

	constructor(gridEntity: GridEntity, x: number, y: number) {
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
		this.tmpHitPosition = new Vector2();
		this.tmpHitNormal = new Vector2();
	}

	collideVsCirclePhysical(
		collision: CollisionResultPhysical,
		param2: vec2,
		param3: vec2,
		param4: vec2,
		param5: number
	): boolean {
		return false;
	}

	collideVsCircleLogical(
		simulator: Simulator,
		ninja: Ninja,
		collision: CollisionResultLogical,
		param4: vec2,
		param5: vec2,
		param6: vec2,
		param7: number,
		param8: number
	): boolean {
		return false;
	}

	think(simulator: Simulator): void {
		let _loc3_ = NaN;
		let _loc4_ = NaN;
		let _loc5_ = NaN;
		let _loc6_ = NaN;
		let _loc7_: int = 0;
		let _loc8_: vec2 = null;
		let _loc9_ = NaN;
		let _loc10_ = NaN;
		let _loc11_ = NaN;
		let _loc12_ = NaN;
		this.tmpHitPosition.x = 0;
		this.tmpHitPosition.y = 0;
		this.tmpHitNormal.x = 0;
		this.tmpHitNormal.y = 0;
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
				if (
					!this.IsCurrentTargetVisible(
						param1,
						this.TEMP_hit_pos,
						this.TEMP_hit_n
					)
				) {
					this.Event_StartIdling();
				} else {
					this.UpdateAim(
						param1.playerList[this.targetIndex].GetPos(),
						param1.playerList[this.targetIndex].GetVel()
					);
					if (this.timer_firetime < this.shot_timer) {
						this.Event_StartFiring();
					}
				}
			} else if (this.CUR_STATE == STATE_PREFIRE) {
				++this.shot_timer;
				if (this.prefire_delay <= this.shot_timer) {
					if (!param1.playerList[this.targetIndex].IsDead()) {
						_loc3_ = this.aim_pos.x - this.pos.x;
						_loc4_ = this.aim_pos.y - this.pos.y;
						_loc5_ = Math.sqrt(_loc3_ * _loc3_ + _loc4_ * _loc4_);
						_loc3_ /= _loc5_;
						_loc4_ /= _loc5_;
						_loc6_ = param1.segGrid.GetRaycastDistance(
							this.pos.x,
							this.pos.y,
							_loc3_,
							_loc4_,
							this.HACKY_hit_pos,
							this.HACKY_hit_n
						);
						_loc7_ = 0;
						while (_loc7_ < param1.playerList.length) {
							if (!param1.playerList[_loc7_].IsDead()) {
								_loc8_ = param1.playerList[_loc7_].GetPos();
								_loc9_ = param1.playerList[_loc7_].GetRadius();
								if (
									colutils.Overlap_Circle_Vs_Segment(
										_loc8_,
										_loc9_,
										this.pos,
										this.HACKY_hit_pos,
										_loc6_
									)
								) {
									_loc10_ = _loc8_.x - this.pos.x;
									_loc11_ = _loc8_.y - this.pos.y;
									_loc12_ = _loc3_ * _loc10_ + _loc4_ * _loc11_;
									this.HACKY_hit_pos.x = this.pos.x + _loc12_ * _loc3_;
									this.HACKY_hit_pos.y = this.pos.y + _loc12_ * _loc4_;
									this.HACKY_hit_n.x = 0;
									this.HACKY_hit_n.y = 0;
									param1.Event_PlayerWasKilled(
										param1.playerList[_loc7_],
										sim_globals.ENEMYTYPE_TURRET,
										this.HACKY_hit_pos.x,
										this.HACKY_hit_pos.y,
										_loc3_ * 8,
										_loc4_ * 8
									);
								}
								this.HACKY_drawtimer = 10;
							}
							_loc7_++;
						}
						param1
							.HACKY_GetParticleManager()
							.Spawn_TurretBullet(this.pos, this.HACKY_hit_pos);
						this.gfx_triggerEvent = true;
					}
					this.Event_StopFiring();
				}
			} else if (this.CUR_STATE == STATE_POSTFIRE) {
				++this.shot_timer;
				if (this.postfire_delay <= this.shot_timer) {
					if (
						this.IsCurrentTargetVisible(
							param1,
							this.TEMP_hit_pos,
							this.TEMP_hit_n
						)
					) {
						this.Event_ResumeTargetting();
					} else {
						this.Event_StartIdling();
					}
				}
			}
		}
	}

	move(simulator: Simulator): void {}

	generateGraphicComponent(): EntityGraphics {
		return null;
	}

	debugDraw(context: CanvasRenderingContext2D): void {}

	private startTargeting(playerIndex: number): void {
		this.aimPosition.setFrom(this.position);
		this.shotTimer = 0;
		this.currentState = TurretState.TARGETING;
		this.targetIndex = playerIndex;
	}
}
