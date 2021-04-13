import type { EntityGraphics } from "../../entity-graphics.js";
import { overlapCircleVsCircle } from "../../fns.js";
import type { CollisionResultLogical } from "../collision-result-logical.js";
import type { GridEntity } from "../grid-entity.js";
import type { Ninja } from "../ninja.js";
import type { Simulator } from "../simulator.js";
import { Vector2 } from "../vector2.js";
import { EntityBase } from "./entity-base";

export class EntityLaunchPad extends EntityBase {
	private position: Vector2;
	private normal: Vector2;
	private r: number;
	private strength: number;
	private gfxTriggerEvent: boolean;

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
		this.r = 12 * 0.5;
		this.strength = 12 * (3 / 7);
		entityGrid.addEntity(this.position, this);
		this.gfxTriggerEvent = false;
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
		let _loc10_ = NaN;
		let _loc11_ = NaN;
		if (overlapCircleVsCircle(this.position, this.r, param4, param7)) {
			_loc9_ = this.position.x - (param4.x - this.normal.x * param7);
			_loc10_ = this.position.y - (param4.y - this.normal.y * param7);
			if (-(param8 = 0.1) <= this.normal.x * _loc9_ + this.normal.y * _loc10_) {
				_loc11_ = 1;
				if (this.normal.y < 0) {
					_loc11_ += Math.abs(this.normal.y);
				}
				if (ninja === null) {
					collision.vectorX = this.normal.x * 12;
					collision.vectorY = this.normal.y * 12;
					this.gfxTriggerEvent = true;
					return true;
				}
				simulator.launchPlayer(
					ninja,
					this.normal.x * this.strength,
					this.normal.y * this.strength * _loc11_
				);
				this.gfxTriggerEvent = true;
			}
		}
		return false;
	}

	generateGraphicComponent(): EntityGraphics | null {
		// return new EntityGraphics_Launchpad(this,this.pos.x,this.pos.y,Math.atan2(this.n.y,this.n.x));
		return null;
	}

	debugDraw(context: CanvasRenderingContext2D): void {
		// param1.SetStyle(0, 0, 100);
		// param1.DrawBox(
		// 	this.pos.x,
		// 	this.pos.y,
		// 	-this.n.y * this.r,
		// 	this.n.x * this.r,
		// 	this.n.x * 2,
		// 	this.n.y * 2
		// );
		// param1.DrawLine(
		// 	this.pos.x,
		// 	this.pos.y,
		// 	this.pos.x + this.n.x * 6,
		// 	this.pos.y + this.n.y * 6
		// );
	}
}
