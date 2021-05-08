import type { EntityGraphics } from "../../graphics/entity-graphics.js";
import { overlapCircleVsCircle } from "../../fns.js";
import type { CollisionResultLogical } from "../collision-result-logical.js";
import type { GridEntity } from "../grid-entity.js";
import type { Ninja } from "../ninja.js";
import { PlayerKillType, SimulationRate, Simulator } from "../simulator.js";
import { Vector2 } from "../vector2.js";
import { EntityBase } from "./entity-base";
import type { GraphicsManager } from "../../graphics-manager.js";

export class EntityFloorGuard extends EntityBase {
	private position: Vector2;
	private speed: number;
	private radius: number;
	private currentState: number;
	private margin: number;

	constructor(entityGrid: GridEntity, x: number, y: number) {
		super();
		this.position = new Vector2(x, y);
		this.radius = 12 * 0.5;
		this.speed = 12 * (3 / 7) * (40 / SimulationRate);
		this.currentState = 0;
		this.margin = 0;
		entityGrid.addEntity(this.position, this);
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
		let _loc9_ = NaN;
		let _loc10_ = NaN;
		let _loc11_ = NaN;
		if (overlapCircleVsCircle(this.position, this.radius, param4, param7)) {
			_loc9_ = param4.x - this.position.x;
			_loc10_ = param4.y - this.position.y;
			_loc11_ = Math.sqrt(_loc9_ * _loc9_ + _loc10_ * _loc10_);
			_loc9_ /= _loc11_;
			_loc10_ /= _loc11_;
			// simulator
			// 	.HACKY_GetParticleManager()
			// 	.Spawn_Zap(
			// 		this.position.x + _loc9_ * this.radius,
			// 		this.position.y + _loc10_ * this.radius,
			// 		(Math.atan2(_loc10_, _loc9_) / Math.PI) * 180
			// 	);
			if (ninja === null) {
				collision.vectorX = _loc9_ * 10;
				collision.vectorY = _loc10_ * 10;
				return true;
			}
			simulator.killPlayer(
				ninja,
				PlayerKillType.FLOOR_GUARD,
				param4.x - _loc9_ * param7,
				param4.y - _loc10_ * param7,
				_loc9_ * 10,
				_loc10_ * 10
			);
		}
		return false;
	}

	think(simulator: Simulator): void {
		let _loc6_ = NaN;
		let _loc7_ = NaN;
		let _loc8_ = 0;
		let _loc9_ = 0;
		let _loc10_ = 0;
		let _loc11_ = 0;
		if (this.currentState === 0) {
			for (const player of simulator.playerList) {
				if (!player.isDead()) {
					const playerPosition = player.getPosition();
					_loc7_ = (_loc6_ = this.position.y + this.radius) - 24;
					if (playerPosition.y >= _loc7_ && playerPosition.y <= _loc6_) {
						_loc8_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
							playerPosition.x
						);
						_loc9_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
							this.position.x
						);
						_loc10_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
							this.position.y
						);
						_loc11_ = 0;
						if (
							simulator.edgeGrid.scanHorizontal(
								_loc10_,
								_loc10_,
								_loc9_,
								_loc8_
							)
						) {
							_loc11_ = 1;
							if (playerPosition.x < this.position.x) {
								_loc11_ = -1;
							}
						}
						if (_loc11_ !== 0) {
							this.currentState = _loc11_;
							break;
						}
					}
				}
			}
		}
	}

	move(simulator: Simulator): void {
		let _loc8_ = 0;
		if (this.currentState === 0) {
			return;
		}
		const _loc3_ = this.radius + this.margin;
		let _loc4_ = this.position.x + this.currentState * this.speed;
		const _loc5_ = this.currentState * _loc3_;
		const _loc6_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
			this.position.x + _loc5_
		);
		const _loc7_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
			_loc4_ + _loc5_
		);
		if (_loc6_ !== _loc7_) {
			_loc8_ = simulator.edgeGrid.getGridCoordinateFromWorldspace1D(
				this.position.y
			);
			if (
				!simulator.edgeGrid.isEmpty(_loc6_, _loc8_, this.currentState, 0) ||
				!simulator.edgeGrid.isSolidIgnoreDoors(_loc7_, _loc8_, 0, 1)
			) {
				_loc4_ =
					simulator.edgeGrid.getWorldspaceCoordinateFromGridEdge1D(
						_loc6_,
						this.currentState
					) -
					this.currentState * (_loc3_ + 0.01);
				this.currentState = 0;
			}
		}
		this.position.x = _loc4_;
		simulator.entityGrid.moveEntity(this.position, this);
	}

	generateGraphicComponent(): EntityGraphics | null {
		// return new EntityGraphics_FloorGuard(this);
		return null;
	}

	debugDraw(gfx: GraphicsManager): void {
		// param1.SetStyle(0, 0, 100);
		// param1.DrawCircle(this.pos.x, this.pos.y, this.r);
		// if (this.CUR_STATE != 0) {
		// 	param1.DrawLine(
		// 		this.pos.x,
		// 		this.pos.y,
		// 		this.pos.x + this.CUR_STATE * 8,
		// 		this.pos.y
		// 	);
		// }
	}
}
