import type { EntityGraphics } from "../../entity-graphics.js";
import { penetrationSquareVsPoint } from "../../fns.js";
import type { CollisionResultLogical } from "../collision-result-logical.js";
import type { CollisionResultPhysical } from "../collision-result-physical.js";
import type { GridEntity } from "../grid-entity.js";
import type { Ninja } from "../ninja.js";
import { SimulationRate, Simulator } from "../simulator.js";
import { Vector2 } from "../vector2.js";
import { EntityBase } from "./entity-base";

export class EntityBounceBlock extends EntityBase {
	private position: Vector2;
	private velocity: Vector2;
	private anchor: Vector2;
	private radius: number;
	private stiff: number;
	private damp: number;
	private mass: number;
	private isSleeping: boolean;
	private normal: Vector2;

	constructor(entityGrid: GridEntity, x: number, y: number) {
		super();
		this.position = new Vector2(x, y);
		this.velocity = new Vector2(0, 0);
		this.anchor = new Vector2(x, y);
		this.radius = 0.8 * 12;
		this.stiff = 0.05 * (40 / SimulationRate) * (40 / SimulationRate);
		this.damp = 0.99;
		if (SimulationRate === 60) {
			this.damp = 0.98;
		}
		this.mass = 0.2;
		this.isSleeping = true;
		entityGrid.addEntity(this.position, this);
		this.normal = new Vector2();
	}

	collideVsCirclePhysical(
		collision: CollisionResultPhysical,
		param2: Vector2,
		param3: Vector2,
		param4: Vector2,
		param5: number
	): boolean {
		let _loc7_ = NaN;
		this.normal.x = 0;
		this.normal.y = 0;
		const _loc6_ = penetrationSquareVsPoint(
			this.position,
			this.radius + param5,
			param2,
			this.normal
		);
		if (_loc6_ !== 0) {
			_loc7_ = (1 - this.mass) * _loc6_;
			this.position.x -= _loc7_ * this.normal.x;
			this.velocity.x -= _loc7_ * this.normal.x;
			this.position.y -= _loc7_ * this.normal.y;
			this.velocity.y -= _loc7_ * this.normal.y;
			collision.isHardCollision = false;
			collision.nx = this.normal.x;
			collision.ny = this.normal.y;
			collision.pen = this.mass * _loc6_;
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

	think(simulator: Simulator): void {
		let _loc2_ = NaN;
		let _loc3_ = NaN;
		let _loc4_ = NaN;
		if (!this.isSleeping) {
			_loc2_ = this.anchor.x - this.position.x;
			_loc3_ = this.anchor.y - this.position.y;
			_loc4_ = _loc2_ * _loc2_ + _loc3_ * _loc3_;
			if (this.velocity.lengthSquared() < 0.05 && _loc4_ < 0.05) {
				this.position.setFrom(this.anchor);
				this.velocity.x = 0;
				this.velocity.y = 0;
				this.isSleeping = true;
			}
		}
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

	debugDraw(context: CanvasRenderingContext2D): void {
		// if(this.isSleeping)
		// {
		// 	 param1.SetStyle(0,0,30);
		// }
		// else
		// {
		// 	 param1.SetStyle(0,0,100);
		// }
		// param1.DrawSquare(this.pos.x,this.pos.y,this.r);
	}
}
