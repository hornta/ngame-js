import type { EntityGraphics } from "../../graphics/entity-graphics.js";
import { penetrationSquareVsPoint } from "../../fns.js";
import type { CollisionResultLogical } from "../collision-result-logical.js";
import type { CollisionResultPhysical } from "../collision-result-physical.js";
import type { GridEntity } from "../grid-entity.js";
import type { Ninja } from "../ninja.js";
import { PlayerKillType, SimulationRate, Simulator } from "../simulator.js";
import { Vector2 } from "../vector2.js";
import { EntityBase } from "./entity-base";
import type { GraphicsManager } from "../../graphics-manager.js";

enum ThwompState {
	IDLE = 0,
	RECEDING = -1,
	FALLING = 1,
}

export class EntityThwomp extends EntityBase {
	anchor: Vector2;
	radius: number;
	fallSpeed: number;
	raiseSpeed: number;
	currentState: ThwompState;
	fallDirection: number;
	isHorizontal: boolean;
	normal: Vector2;

	constructor(
		entityGrid: GridEntity,
		position: Vector2,
		fallDirection: number,
		isHorizontal: boolean
	) {
		super(position);
		this.anchor = this.position.clone();
		this.radius = 12 * (3 / 4);
		this.fallSpeed = 12 * (5 / 14) * (40 / SimulationRate);
		this.raiseSpeed = 12 * (1 / 7) * (40 / SimulationRate);
		this.currentState = ThwompState.IDLE;
		this.fallDirection = fallDirection;
		this.isHorizontal = isHorizontal;
		entityGrid.addEntity(this.position, this);
		this.normal = new Vector2();
	}

	collideVsNinjaPhysical(
		collision: CollisionResultPhysical,
		position: Vector2,
		velocity: Vector2,
		oldPosition: Vector2,
		radius: number
	): boolean {
		this.normal.x = 0;
		this.normal.y = 0;
		const _loc6_ = penetrationSquareVsPoint(
			this.position,
			this.radius + radius,
			position,
			this.normal
		);
		if (_loc6_ !== 0) {
			collision.isHardCollision = false;
			collision.nx = this.normal.x;
			collision.ny = this.normal.y;
			collision.pen = _loc6_;
			return true;
		}
		return false;
	}

	collideVsNinjaLogical(
		simulator: Simulator,
		ninja: Ninja,
		collision: CollisionResultLogical,
		param4: Vector2,
		param5: Vector2,
		param6: Vector2,
		param7: number,
		param8: number
	): boolean {
		param8 = 0.1;
		this.normal.x = 0;
		this.normal.y = 0;
		const _loc9_ = penetrationSquareVsPoint(
			this.position,
			param8 + this.radius + param7,
			param4,
			this.normal
		);
		if (_loc9_ !== 0) {
			if (
				(this.isHorizontal && this.normal.x * this.fallDirection > 0) ||
				(!this.isHorizontal && this.normal.y * this.fallDirection > 0)
			) {
				if (this.isHorizontal) {
					// simulator
					// 	.HACKY_GetParticleManager()
					// 	.Spawn_ZapThwompH(this.pos, this.r * this.falldir, this.r);
				} else {
					// simulator
					// 	.HACKY_GetParticleManager()
					// 	.Spawn_ZapThwompV(this.pos, this.r, this.r * this.falldir);
				}
				if (ninja === null) {
					collision.vectorX = this.normal.x * 8;
					collision.vectorY = this.normal.y * 8 - 4;
					return true;
				}
				simulator.killPlayer(
					ninja,
					PlayerKillType.THWOMP,
					param4.x - this.normal.x * param7,
					param4.y - this.normal.y * param7,
					this.normal.x * 8,
					this.normal.y * 8 - 4
				);
			} else if (ninja !== null) {
				collision.vectorX = this.normal.x;
				collision.vectorY = this.normal.y;
				return true;
			}
		}
		return false;
	}

	think(simulator: Simulator): void {
		if (this.currentState === ThwompState.IDLE) {
			for (const player of simulator.playerList) {
				if (!player.isDead()) {
					const playerPosition = player.getPosition();
					const playerRadius = player.getRadius();
					const dx = playerPosition.x - this.position.x;
					const dy = playerPosition.y - this.position.y;
					const _loc9_ = 2 * (this.radius + playerRadius);
					if (this.isHorizontal) {
						if (Math.abs(dy) < _loc9_) {
							const _loc10_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
								this.position.x - this.fallDirection * this.radius
							);
							const _loc11_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
								this.position.y - this.radius
							);
							const _loc12_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
								this.position.y + this.radius
							);
							const _loc13_ = simulator.edgeGrid.sweepHorizontal(
								_loc11_,
								_loc12_,
								_loc10_,
								this.fallDirection
							);
							const _loc14_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
								playerPosition.x
							);
							if (
								!(
									_loc14_ < Math.min(_loc10_, _loc13_) ||
									_loc14_ > Math.max(_loc10_, _loc13_)
								)
							) {
								this.currentState = 1;
								break;
							}
						}
					} else if (Math.abs(dx) < _loc9_) {
						const _loc15_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
							this.position.y - this.fallDirection * this.radius
						);
						const _loc16_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
							this.position.x - this.radius
						);
						const _loc17_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
							this.position.x + this.radius
						);
						const _loc18_ = simulator.edgeGrid.sweepVertical(
							_loc16_,
							_loc17_,
							_loc15_,
							this.fallDirection
						);
						const _loc19_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
							playerPosition.y
						);
						if (
							!(
								_loc19_ < Math.min(_loc15_, _loc18_) ||
								_loc19_ > Math.max(_loc15_, _loc18_)
							)
						) {
							this.currentState = 1;
						}
						continue;
						break;
					}
				}
			}
		}
	}

	move(simulator: Simulator): void {
		if (this.currentState === ThwompState.IDLE) {
			return;
		}
		const _loc3_ = this.fallDirection * this.currentState;
		const _loc4_ = _loc3_ * this.radius;
		let _loc5_ = this.fallSpeed;
		if (this.currentState === -1) {
			_loc5_ = this.raiseSpeed;
		}
		if (this.isHorizontal) {
			let _loc6_ = this.position.x + _loc3_ * _loc5_;
			if (this.currentState === -1) {
				if ((this.position.x - this.anchor.x) * (_loc6_ - this.anchor.x) <= 0) {
					_loc6_ = this.anchor.x;
				}
			}
			const _loc7_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
				this.position.x + _loc4_
			);
			const _loc8_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
				_loc6_ + _loc4_
			);
			if (_loc7_ !== _loc8_) {
				const _loc9_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
					this.position.y - this.radius
				);
				const _loc10_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
					this.position.y + this.radius
				);
				if (
					!simulator.edgeGrid.isEmptyColumn(_loc7_, _loc9_, _loc10_, _loc3_)
				) {
					if (this.currentState !== -1) {
						this.currentState = -1;
					}
					return;
				}
			}
			this.position.x = _loc6_;
			simulator.entityGrid.moveEntity(this.position, this);
			if (this.currentState === -1 && this.position.x === this.anchor.x) {
				this.currentState = ThwompState.IDLE;
			}
		} else {
			let _loc11_ = this.position.y + _loc3_ * _loc5_;
			if (this.currentState === -1) {
				if (
					(this.position.y - this.anchor.y) * (_loc11_ - this.anchor.y) <=
					0
				) {
					_loc11_ = this.anchor.y;
				}
			}
			const _loc12_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
				this.position.y + _loc4_
			);
			const _loc13_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
				_loc11_ + _loc4_
			);
			if (_loc12_ !== _loc13_) {
				const _loc14_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
					this.position.x - this.radius
				);
				const _loc15_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
					this.position.x + this.radius
				);
				if (!simulator.edgeGrid.isEmptyRow(_loc12_, _loc14_, _loc15_, _loc3_)) {
					if (this.currentState !== -1) {
						this.currentState = -1;
					}
					return;
				}
			}
			this.position.y = _loc11_;
			simulator.entityGrid.moveEntity(this.position, this);
			if (this.currentState === -1 && this.position.y === this.anchor.y) {
				this.currentState = 0;
			}
		}
	}

	generateGraphicComponent(): EntityGraphics | null {
		// let _loc1_ = 0;
		// if (this.isHorizontal) {
		// 	if (this.falldir < 0) {
		// 		_loc1_ = Math.PI;
		// 	}
		// } else if (this.falldir < 0) {
		// 	_loc1_ = 1.5 * Math.PI;
		// } else {
		// 	_loc1_ = 0.5 * Math.PI;
		// }
		// return new EntityGraphics_Thwomp(this, _loc1_);
		return null;
	}

	debugDraw(gfx: GraphicsManager): void {
		// param1.SetStyle(0, 0, 100);
		// param1.DrawSquare(this.pos.x, this.pos.y, this.r);
		// let _loc2_: int = -4;
		// while (_loc2_ <= 4) {
		// 	if (this.isHorizontal) {
		// 		param1.DrawLine(
		// 			this.pos.x + this.falldir * this.r - 2,
		// 			this.pos.y + _loc2_,
		// 			this.pos.x + this.falldir * this.r + 2,
		// 			this.pos.y + _loc2_
		// 		);
		// 	} else {
		// 		param1.DrawLine(
		// 			this.pos.x + _loc2_,
		// 			this.pos.y + this.falldir * this.r - 2,
		// 			this.pos.x + _loc2_,
		// 			this.pos.y + this.falldir * this.r + 2
		// 		);
		// 	}
		// 	_loc2_ += 4;
		// }
		// if (this.CUR_STATE != 0) {
		// 	if (this.isHorizontal) {
		// 		param1.DrawLine(
		// 			this.pos.x,
		// 			this.pos.y,
		// 			this.pos.x + this.falldir * this.CUR_STATE * 8,
		// 			this.pos.y
		// 		);
		// 	} else {
		// 		param1.DrawLine(
		// 			this.pos.x,
		// 			this.pos.y,
		// 			this.pos.x,
		// 			this.pos.y + this.falldir * this.CUR_STATE * 8
		// 		);
		// 	}
		// }
	}
}
