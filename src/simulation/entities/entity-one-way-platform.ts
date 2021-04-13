import type { EntityGraphics } from "../../entity-graphics.js";
import type { CollisionResultLogical } from "../collision-result-logical.js";
import type { CollisionResultPhysical } from "../collision-result-physical.js";
import type { GridEntity } from "../grid-entity.js";
import type { Ninja } from "../ninja.js";
import type { Simulator } from "../simulator.js";
import { Vector2 } from "../vector2.js";
import { EntityBase } from "./entity-base";

export class EntityOneWayPlatform extends EntityBase {
	private position: Vector2;
	private normal: Vector2;
	private r: number;

	constructor(
		entityGrid: GridEntity,
		x: number,
		y: number,
		normalX: number,
		normalY: number
	) {
		super();
		this.position = new Vector2(x, y);
		this.normal = new Vector2(normalX, normalY);
		this.r = 12;
		entityGrid.addEntity(this.position, this);
	}

	collideVsCirclePhysical(
		collision: CollisionResultPhysical,
		param2: Vector2,
		param3: Vector2,
		param4: Vector2,
		param5: number
	): boolean {
		let _loc6_ = NaN;
		if (
			(_loc6_ = this.calculatePenetration(param2, param3, param4, param5, 0)) >=
			0
		) {
			collision.isHardCollision = true;
			collision.nx = this.normal.x;
			collision.ny = this.normal.y;
			collision.pen = _loc6_;
			return true;
		}
		return false;
	}

	collideVsCircleLogical(
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
		if (ninja !== null) {
			if (
				(_loc9_ = this.calculatePenetration(
					param4,
					param5,
					param6,
					param7,
					param8
				)) >= 0
			) {
				collision.vectorX = this.normal.x;
				collision.vectorY = this.normal.y;
				return true;
			}
		}
		return false;
	}

	generateGraphicComponent(): EntityGraphics | null {
		// return new EntityGraphics_OnewayPlatform(
		// 	this.pos.x,
		// 	this.pos.y,
		// 	Math.atan2(this.n.y, this.n.x)
		// );
		return null;
	}

	debugDraw(context: CanvasRenderingContext2D): void {
		// param1.SetStyle(0, 0, 100);
		// param1.DrawLine(
		// 	this.pos.x - -this.n.y * this.r,
		// 	this.pos.y - this.n.x * this.r,
		// 	this.pos.x + -this.n.y * this.r,
		// 	this.pos.y + this.n.x * this.r
		// );
		// param1.DrawLine(
		// 	this.pos.x,
		// 	this.pos.y,
		// 	this.pos.x + this.n.x * 4,
		// 	this.pos.y + this.n.y * 4
		// );
	}

	private calculatePenetration(
		param1: Vector2,
		param2: Vector2,
		param3: Vector2,
		param4: number,
		param5: number
	): number {
		let _loc9_ = NaN;
		let _loc10_ = NaN;
		let _loc11_ = NaN;
		let _loc12_ = NaN;
		let _loc13_ = NaN;
		let _loc14_ = NaN;
		const _loc6_ = param1.x - this.position.x;
		const _loc7_ = param1.y - this.position.y;
		const _loc8_ =
			this.r +
			param4 -
			Math.abs(-this.normal.y * _loc6_ + this.normal.x * _loc7_);
		if (0 < _loc8_) {
			_loc9_ =
				param4 +
				param5 -
				Math.abs(this.normal.x * _loc6_ + this.normal.y * _loc7_);
			if (0 < _loc9_) {
				if (
					(_loc10_ = this.normal.x * param2.x + this.normal.y * param2.y) <= 0
				) {
					_loc11_ = param3.x - this.position.x;
					_loc12_ = param3.y - this.position.y;
					if (
						(_loc13_ =
							param4 - (this.normal.x * _loc11_ + this.normal.y * _loc12_)) <=
						1.1
					) {
						if (
							(_loc14_ =
								param4 - (this.normal.x * _loc6_ + this.normal.y * _loc7_)) < 0
						) {
							throw new Error(
								`WARNING! EntityOneWayPlatform.calculatePenetration() found conflicting penetration: ${_loc8_},${_loc9_},${_loc14_}`
							);
						}
						return _loc14_;
					}
				}
			}
		}
		return -1;
	}
}
