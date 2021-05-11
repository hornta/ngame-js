import type { EntityGraphics } from "../../graphics/entity-graphics.js";
import { penetrationSquareVsPoint } from "../../fns.js";
import type { GraphicsManager } from "../../graphics-manager.js";
import type { CollisionResultLogical } from "../collision-result-logical.js";
import type { CollisionResultPhysical } from "../collision-result-physical.js";
import type { GridEntity } from "../grid-entity.js";
import type { Ninja } from "../ninja.js";
import { SimulationRate, Simulator } from "../simulator.js";
import { Vector2 } from "../vector2.js";
import { EntityBase } from "./entity-base";
export class EntityBounceBlock extends EntityBase {
	private velocity: Vector2;
	private anchor: Vector2;
	public radius: number;
	private stiff: number;
	private damp: number;
	private mass: number;
	private normal: Vector2;

	constructor(entityGrid: GridEntity, position: Vector2) {
		super(position);
		this.velocity = new Vector2();
		this.anchor = this.position.clone();
		this.radius = 0.8 * 12;
		this.stiff = 0.05 * (40 / SimulationRate) * (40 / SimulationRate);
		this.damp = 0.99;
		if (SimulationRate === 60) {
			this.damp = 0.98;
		}
		this.mass = 0.2;
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
		const penetration = penetrationSquareVsPoint(
			this.position,
			this.radius + radius,
			position,
			this.normal
		);
		if (penetration !== 0) {
			const _loc7_ = (1 - this.mass) * penetration;
			this.position.x -= _loc7_ * this.normal.x;
			this.velocity.x -= _loc7_ * this.normal.x;
			this.position.y -= _loc7_ * this.normal.y;
			this.velocity.y -= _loc7_ * this.normal.y;
			collision.isHardCollision = false;
			collision.nx = this.normal.x;
			collision.ny = this.normal.y;
			collision.pen = this.mass * penetration;
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
			this.normal.x = 0;
			this.normal.y = 0;
			const _loc9_ = penetrationSquareVsPoint(
				this.position,
				param8 + this.radius + param7,
				param4,
				this.normal
			);
			if (_loc9_ !== 0) {
				collision.vectorX = this.normal.x;
				collision.vectorY = this.normal.y;
				return true;
			}
		}
		return false;
	}

	move(simulator: Simulator): void {
		this.velocity.scale(this.damp);
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		let _loc2_: number = this.anchor.x - this.position.x;
		let _loc3_: number = this.anchor.y - this.position.y;
		_loc2_ *= this.stiff;
		_loc3_ *= this.stiff;
		this.position.x += _loc2_;
		this.position.y += _loc3_;
		this.velocity.x += _loc2_;
		this.velocity.y += _loc3_;
		simulator.entityGrid.moveEntity(this.position, this);
	}

	generateGraphicComponent(): EntityGraphics | null {
		// return new EntityGraphics_BounceBlock(this);
		return null;
	}

	debugDraw(gfx: GraphicsManager): void {
		gfx.setStyle("rgb(0,0,0)", 1);
		gfx.renderSquare(this.position.x, this.position.y, this.radius);
	}
}
