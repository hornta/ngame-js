import type { EntityGraphics } from "../../graphics/entity-graphics.js";
import type { GraphicsManager } from "../../graphics-manager.js";
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
	private radius: number;

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
		this.radius = 12;
		entityGrid.addEntity(this.position, this);
	}

	collideVsNinjaPhysical(
		collision: CollisionResultPhysical,
		position: Vector2,
		velocity: Vector2,
		oldPosition: Vector2,
		radius: number
	): boolean {
		const penetration = this.calculatePenetration(
			position,
			velocity,
			oldPosition,
			radius,
			0
		);
		if (penetration >= 0) {
			collision.isHardCollision = true;
			collision.nx = this.normal.x;
			collision.ny = this.normal.y;
			collision.pen = penetration;
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
		if (ninja !== null) {
			const penetration = this.calculatePenetration(
				param4,
				param5,
				param6,
				param7,
				param8
			);
			if (penetration >= 0) {
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

	debugDraw(gfx: GraphicsManager): void {
		gfx.renderLine(
			new Vector2(
				this.position.x - -this.normal.y * this.radius,
				this.position.y - this.normal.x * this.radius
			),
			new Vector2(
				this.position.x + -this.normal.y * this.radius,
				this.position.y + this.normal.x * this.radius
			)
		);
		gfx.renderLine(
			new Vector2(this.position.x, this.position.y),
			new Vector2(
				this.position.x + this.normal.x * 4,
				this.position.y + this.normal.y * 4
			)
		);
	}

	private calculatePenetration(
		position: Vector2,
		velocity: Vector2,
		oldPosition: Vector2,
		radius: number,
		param5: number
	): number {
		const deltaX = position.x - this.position.x;
		const deltaY = position.y - this.position.y;
		const _loc8_ =
			this.radius +
			radius -
			Math.abs(-this.normal.y * deltaX + this.normal.x * deltaY);
		if (0 < _loc8_) {
			const _loc9_ =
				radius +
				param5 -
				Math.abs(this.normal.x * deltaX + this.normal.y * deltaY);
			if (0 < _loc9_) {
				const _loc10_ = this.normal.x * velocity.x + this.normal.y * velocity.y;
				if (_loc10_ <= 0) {
					const _loc11_ = oldPosition.x - this.position.x;
					const _loc12_ = oldPosition.y - this.position.y;
					const _loc13_ =
						radius - (this.normal.x * _loc11_ + this.normal.y * _loc12_);
					if (_loc13_ <= 1.1) {
						const _loc14_ =
							radius - (this.normal.x * deltaX + this.normal.y * deltaY);
						if (_loc14_ < 0) {
							// return -1;
							// throw new Error(
							// 	`WARNING! EntityOneWayPlatform.calculatePenetration() found conflicting penetration: ${_loc8_},${_loc9_},${_loc14_}`
							// );
						}
						return _loc14_;
					}
				}
			}
		}
		return -1;
	}
}
