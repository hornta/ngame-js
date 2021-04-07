import {
	timeOfIntersectionCircleVsCircle,
	timeOfIntersectionPointVsLineSegment,
} from "src/fns";
import type { AABB } from "./AABB";
import type { Segment } from "./segment";
import type { Vector2 } from "./vector2";

export class SegmentLinear implements Segment {
	p0: Vector2;
	p1: Vector2;
	aabb: AABB;

	constructor(x1: number, y1: number, x2: number, y2: number) {
		this.cp = new Vector2();
		this.rayPoint = new Vector2();
		this.p0 = new Vector2(x1, y1);
		this.p1 = new Vector2(x2, y2);
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
		let _loc9_ = NaN;
		const _loc3_ = this.p1.x - this.p0.x;
		const _loc4_ = this.p1.y - this.p0.y;
		const _loc5_ = param1.x - this.p0.x;
		const _loc6_ = param1.y - this.p0.y;
		const _loc7_ = _loc3_ * _loc5_ + _loc4_ * _loc6_;
		const _loc8_ = _loc3_ * _loc3_ + _loc4_ * _loc4_;
		if (_loc7_ <= 0) {
			param2.setFrom(this.p0);
		} else if (_loc7_ >= _loc8_) {
			param2.setFrom(this.p1);
		} else {
			_loc9_ = _loc7_ / _loc8_;
			param2.x = this.p0.x + _loc9_ * _loc3_;
			param2.y = this.p0.y + _loc9_ * _loc4_;
		}
	}

	getClosestPointIsBackfacing(param1: Vector2, param2: Vector2): boolean {
		let _loc9_ = NaN;
		const _loc3_: number = this.p1.x - this.p0.x;
		const _loc4_: number = this.p1.y - this.p0.y;
		const _loc5_: number = param1.x - this.p0.x;
		const _loc6_: number = param1.y - this.p0.y;
		const _loc7_: number = _loc3_ * _loc5_ + _loc4_ * _loc6_;
		const _loc8_: number = _loc3_ * _loc3_ + _loc4_ * _loc4_;
		if (_loc7_ <= 0) {
			param2.setFrom(this.p0);
		} else if (_loc7_ >= _loc8_) {
			param2.setFrom(this.p1);
		} else {
			_loc9_ = _loc7_ / _loc8_;
			param2.x = this.p0.x + _loc9_ * _loc3_;
			param2.y = this.p0.y + _loc9_ * _loc4_;
		}
		return _loc5_ * -_loc4_ + _loc6_ * _loc3_ < 0;
	}

	intersectWithRay(
		param1: Vector2,
		param2: Vector2,
		param3: number,
		param4: Vector2,
		param5: Vector2
	): number {
		let _loc10_ = NaN;
		let _loc11_ = NaN;
		let _loc12_ = NaN;
		let _loc13_ = NaN;
		let _loc14_ = NaN;
		let _loc15_ = NaN;
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
		const _loc8_ = timeOfIntersectionPointVsLineSegment(
			param1,
			param2,
			this.p0,
			this.p1,
			param3
		);
		let _loc9_;
		const rayPoint = new Vector2();
		const cp = new Vector2();
		if ((_loc9_ = Math.min(_loc6_, _loc7_, _loc8_)) <= 1 && _loc9_ >= 0) {
			rayPoint.x = param1.x + _loc9_ * param2.x;
			rayPoint.y = param1.y + _loc9_ * param2.y;
			if (param3 > 0) {
				cp.x = 0;
				cp.y = 0;
				this.getClosestPoint(rayPoint, cp);
				_loc10_ = rayPoint.x - cp.x;
				_loc11_ = rayPoint.y - cp.y;
				_loc12_ = Math.sqrt(_loc10_ * _loc10_ + _loc11_ * _loc11_);
				_loc10_ /= _loc12_;
				_loc11_ /= _loc12_;
				param4.x = cp.x;
				param4.y = cp.y;
				param5.x = _loc10_;
				param5.y = _loc11_;
			} else {
				_loc13_ = -(this.p1.y - this.p0.y);
				_loc14_ = this.p1.x - this.p0.x;
				_loc15_ = Math.sqrt(_loc13_ * _loc13_ + _loc14_ * _loc14_);
				_loc13_ /= _loc15_;
				_loc14_ /= _loc15_;
				if (_loc13_ * param2.x + _loc14_ * param2.y > 0) {
					_loc13_ *= -1;
					_loc14_ *= -1;
				}
				param4.setFrom(rayPoint);
				param5.x = _loc13_;
				param5.y = _loc14_;
			}
		}
		return _loc9_;
	}

	// DebugDraw(param1: SimpleRenderer): void {
	// 	param1.SetStyle(0, 0, 100);
	// 	this.DebugDraw_NoStyle(param1);
	// }

	// DebugDraw_Simple(param1: SimpleRenderer): void {
	// 	param1.DrawLine(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
	// }

	// DebugDraw_NoStyle(param1: SimpleRenderer): void {
	// 	param1.DrawLine(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
	// 	param1.DrawSquare(this.p0.x, this.p0.y, 2);
	// 	param1.DrawSquare(this.p1.x, this.p1.y, 2);
	// 	const _loc2_: vec2 = this.p0.To(this.p1);
	// 	const _loc3_: vec2 = _loc2_.Perp();
	// 	_loc3_.Normalize();
	// 	param1.DrawLine(
	// 		this.p0.x + 0.5 * _loc2_.x,
	// 		this.p0.y + 0.5 * _loc2_.y,
	// 		this.p0.x + 0.5 * _loc2_.x + 4 * _loc3_.x,
	// 		this.p0.y + 0.5 * _loc2_.y + 4 * _loc3_.y
	// 	);
	// }
}
