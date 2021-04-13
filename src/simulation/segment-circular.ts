import {
	timeOfIntersectionCircleVsArc,
	timeOfIntersectionCircleVsCircle,
} from "../fns";
import { AABB } from "./aabb.js";
import type { Segment } from "./segment";
import { Vector2 } from "./vector2.js";

export class SegmentCircular implements Segment {
	p0: Vector2;
	p1: Vector2;
	pC: Vector2;
	aabb: AABB;

	constructor(
		param1: number,
		param2: number,
		param3: number,
		param4: number,
		param5: number,
		param6: number
	) {
		this.p0 = new Vector2(param3, param4);
		this.p1 = new Vector2(param5, param6);
		this.pC = new Vector2(param1, param2);
		this.aabb = new AABB(
			Math.min(this.p0.x, this.p1.x),
			Math.min(this.p0.y, this.p1.y),
			Math.max(this.p0.x, this.p1.x),
			Math.max(this.p0.y, this.p1.y)
		);
	}

	getAABB(): AABB {
		return this.aabb;
	}

	getClosestPoint(param1: Vector2, param2: Vector2): void {
		let _loc17_ = NaN;
		let _loc18_ = NaN;
		const _loc3_ = this.p0.x - this.pC.x;
		const _loc4_ = this.p0.y - this.pC.y;
		const _loc5_ = this.p1.x - this.pC.x;
		const _loc6_ = this.p1.y - this.pC.y;
		let _loc7_ = param1.x - this.pC.x;
		let _loc8_ = param1.y - this.pC.y;
		const _loc9_ = _loc7_ * -_loc4_ + _loc8_ * _loc3_;
		const _loc10_ = _loc7_ * -_loc6_ + _loc8_ * _loc5_;
		const _loc11_ = this.p1.x - this.p0.x;
		const _loc12_ = this.p1.y - this.p0.y;
		const _loc13_ = _loc11_ * -_loc4_ + _loc12_ * _loc3_;
		const _loc14_ = _loc11_ * -_loc6_ + _loc12_ * _loc5_;
		const _loc15_ = _loc9_ * _loc13_ <= 0;
		const _loc16_ = _loc10_ * _loc14_ >= 0;
		if (_loc15_) {
			if (_loc16_) {
				if (_loc7_ * _loc11_ + _loc8_ * _loc12_ <= 0) {
					param2.setFrom(this.p0);
				} else {
					param2.setFrom(this.p1);
				}
			} else {
				param2.setFrom(this.p0);
			}
		} else if (_loc16_) {
			param2.setFrom(this.p1);
		} else {
			_loc17_ = Math.sqrt(_loc3_ * _loc3_ + _loc4_ * _loc4_);
			_loc18_ = Math.sqrt(_loc7_ * _loc7_ + _loc8_ * _loc8_);
			_loc7_ /= _loc18_;
			_loc8_ /= _loc18_;
			_loc7_ *= _loc17_;
			_loc8_ *= _loc17_;
			param2.x = this.pC.x + _loc7_;
			param2.y = this.pC.y + _loc8_;
		}
	}

	getClosestPointIsBackfacing(param1: Vector2, param2: Vector2): boolean {
		let _loc20_ = NaN;
		let _loc21_ = NaN;
		let _loc22_ = NaN;
		let _loc23_ = NaN;
		const _loc3_ = this.p0.x - this.pC.x;
		const _loc4_ = this.p0.y - this.pC.y;
		const _loc5_ = this.p1.x - this.pC.x;
		const _loc6_ = this.p1.y - this.pC.y;
		let _loc7_ = param1.x - this.pC.x;
		let _loc8_ = param1.y - this.pC.y;
		const _loc9_ = _loc7_ * -_loc4_ + _loc8_ * _loc3_;
		const _loc10_ = _loc7_ * -_loc6_ + _loc8_ * _loc5_;
		const _loc11_ = this.p1.x - this.p0.x;
		const _loc12_ = this.p1.y - this.p0.y;
		const _loc13_ = _loc11_ * -_loc4_ + _loc12_ * _loc3_;
		const _loc14_ = _loc11_ * -_loc6_ + _loc12_ * _loc5_;
		const _loc15_ = _loc9_ * _loc13_ <= 0;
		const _loc16_ = _loc10_ * _loc14_ >= 0;
		let _loc17_ = -1;
		if (_loc15_) {
			if (_loc16_) {
				if (_loc7_ * _loc11_ + _loc8_ * _loc12_ <= 0) {
					param2.setFrom(this.p0);
					_loc17_ = 0;
				} else {
					param2.setFrom(this.p1);
					_loc17_ = 1;
				}
			} else {
				param2.setFrom(this.p0);
				_loc17_ = 0;
			}
		} else if (_loc16_) {
			param2.setFrom(this.p1);
			_loc17_ = 1;
		} else {
			_loc20_ = Math.sqrt(_loc3_ * _loc3_ + _loc4_ * _loc4_);
			_loc21_ = Math.sqrt(_loc7_ * _loc7_ + _loc8_ * _loc8_);
			_loc7_ /= _loc21_;
			_loc8_ /= _loc21_;
			_loc7_ *= _loc20_;
			_loc8_ *= _loc20_;
			param2.x = this.pC.x + _loc7_;
			param2.y = this.pC.y + _loc8_;
		}
		const _loc18_ = param2.x - param1.x;
		const _loc19_ = param2.y - param1.y;
		if (_loc17_ < 0) {
			return _loc18_ * -_loc12_ + _loc19_ * _loc11_ > 0;
		}
		_loc22_ = _loc3_;
		_loc23_ = _loc4_;
		if (_loc17_ === 1) {
			_loc22_ = _loc5_;
			_loc23_ = _loc6_;
		}
		if (_loc22_ * -_loc12_ + _loc23_ * _loc11_ < 0) {
			_loc22_ *= -1;
			_loc23_ *= -1;
		}
		return _loc18_ * _loc22_ + _loc19_ * _loc23_ > 0;
	}

	intersectWithRay(
		param1: Vector2,
		param2: Vector2,
		param3: number,
		param4: Vector2,
		param5: Vector2
	): number {
		let _loc13_ = NaN;
		let _loc14_ = NaN;
		let _loc15_ = NaN;
		let _loc16_ = NaN;
		let _loc17_ = NaN;
		let _loc18_ = NaN;
		const _loc6_ = timeOfIntersectionCircleVsCircle(
			param1,
			param2,
			this.p0,
			new Vector2(0, 0),
			param3
		);
		const _loc7_ = timeOfIntersectionCircleVsCircle(
			param1,
			param2,
			this.p1,
			new Vector2(0, 0),
			param3
		);
		let _loc8_ = 2;
		const cp = new Vector2();
		this.getClosestPoint(param1, cp);
		const _loc9_ = param1.x - cp.x;
		const _loc10_ = param1.y - cp.y;
		const _loc11_ = Math.sqrt(_loc9_ * _loc9_ + _loc10_ * _loc10_);
		if (_loc11_ <= param3) {
			_loc8_ = -1;
		} else {
			_loc8_ = timeOfIntersectionCircleVsArc(
				param1,
				param2,
				this.pC,
				this.p0,
				this.p1,
				param3
			);
		}
		const ray_point = new Vector2();
		let _loc12_: number;
		if ((_loc12_ = Math.min(_loc6_, _loc7_, _loc8_)) <= 1 && _loc12_ >= 0) {
			ray_point.x = param1.x + _loc12_ * param2.x;
			ray_point.y = param1.y + _loc12_ * param2.y;
			if (param3 > 0) {
				this.getClosestPoint(ray_point, cp);
				_loc13_ = ray_point.x - cp.x;
				_loc14_ = ray_point.y - cp.y;
				_loc15_ = Math.sqrt(_loc13_ * _loc13_ + _loc14_ * _loc14_);
				_loc13_ /= _loc15_;
				_loc14_ /= _loc15_;
				param4.x = cp.x;
				param4.y = cp.y;
				param5.x = _loc13_;
				param5.y = _loc14_;
			} else {
				_loc16_ = ray_point.x - this.pC.x;
				_loc17_ = ray_point.y - this.pC.y;
				_loc18_ = Math.sqrt(_loc16_ * _loc16_ + _loc17_ * _loc17_);
				_loc16_ /= _loc18_;
				_loc17_ /= _loc18_;
				if (_loc16_ * param2.x + _loc17_ * param2.y > 0) {
					_loc16_ *= -1;
					_loc17_ *= -1;
				}
				param4.setFrom(ray_point);
				param5.x = _loc16_;
				param5.y = _loc17_;
			}
		}
		return _loc12_;
	}

	public debugDraw(/* param1: SimpleRenderer */): void {
		// param1.SetStyle(0, 0, 100);
		// this.DebugDraw_NoStyle(param1);
	}

	public debugDrawSimple(/* param1: SimpleRenderer */): void {
		// param1.DrawCircularArc_Convex(
		// 	this.pC.x,
		// 	this.pC.y,
		// 	this.p0.x,
		// 	this.p0.y,
		// 	this.p1.x,
		// 	this.p1.y,
		// 	this.pC.To(this.p0).Len()
		// );
	}

	public debugDrawNoStyle(/*param1: SimpleRenderer*/): void {
		// param1.DrawCircularArc_Convex(
		// 	this.pC.x,
		// 	this.pC.y,
		// 	this.p0.x,
		// 	this.p0.y,
		// 	this.p1.x,
		// 	this.p1.y,
		// 	this.pC.To(this.p0).Len()
		// );
		// param1.DrawSquare(this.p0.x, this.p0.y, 2);
		// param1.DrawSquare(this.p1.x, this.p1.y, 2);
		// param1.DrawPlus(this.pC.x, this.pC.y, 2);
		// const _loc2_: number = this.pC.To(this.p0).Len();
		// const _loc3_: vec2 = this.p0.To(this.p1);
		// let _loc4_: vec2;
		// (_loc4_ = _loc3_.Perp()).Normalize();
		// _loc3_.Scale(0.5);
		// let _loc5_: vec2;
		// (_loc5_ = this.pC.To(this.p0.Plus(_loc3_))).Normalize();
		// _loc5_.Scale(_loc2_);
		// param1.DrawLine(
		// 	this.pC.x + _loc5_.x,
		// 	this.pC.y + _loc5_.y,
		// 	this.pC.x + _loc5_.x + 4 * _loc4_.x,
		// 	this.pC.y + _loc5_.y + 4 * _loc4_.y
		// );
	}
}
