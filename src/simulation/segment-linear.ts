import {
	timeOfIntersectionCircleVsCircle,
	timeOfIntersectionPointVsLineSegment,
} from "../fns";
import type { GraphicsManager } from "../graphics-manager.js";
import { AABB } from "./aabb.js";
import type { Segment } from "./segment";
import { Vector2 } from "./vector2.js";

export class SegmentLinear implements Segment {
	p0: Vector2;
	p1: Vector2;
	aabb: AABB;

	constructor(x1: number, y1: number, x2: number, y2: number) {
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

	getClosestPointIsBackfacing(param1: Vector2, closestPoint: Vector2): boolean {
		const _loc3_ = this.p1.x - this.p0.x;
		const _loc4_ = this.p1.y - this.p0.y;
		const _loc5_ = param1.x - this.p0.x;
		const _loc6_ = param1.y - this.p0.y;
		const _loc7_ = _loc3_ * _loc5_ + _loc4_ * _loc6_;
		const _loc8_ = _loc3_ * _loc3_ + _loc4_ * _loc4_;
		if (_loc7_ <= 0) {
			closestPoint.setFrom(this.p0);
		} else if (_loc7_ >= _loc8_) {
			closestPoint.setFrom(this.p1);
		} else {
			const _loc9_ = _loc7_ / _loc8_;
			closestPoint.x = this.p0.x + _loc9_ * _loc3_;
			closestPoint.y = this.p0.y + _loc9_ * _loc4_;
		}
		return _loc5_ * -_loc4_ + _loc6_ * _loc3_ < 0;
	}

	intersectWithRay(
		rayStart: Vector2,
		rayEnd: Vector2,
		outPosition: Vector2,
		outNormal: Vector2
	): number {
		let _loc13_ = NaN;
		let _loc14_ = NaN;
		let _loc15_ = NaN;
		const _loc6_ = timeOfIntersectionCircleVsCircle(rayStart, rayEnd, this.p0);
		const _loc7_ = timeOfIntersectionCircleVsCircle(rayStart, rayEnd, this.p1);
		const _loc8_ = timeOfIntersectionPointVsLineSegment(
			rayStart,
			rayEnd,
			this.p0,
			this.p1
		);
		let _loc9_;
		const rayPoint = new Vector2();
		if ((_loc9_ = Math.min(_loc6_, _loc7_, _loc8_)) <= 1 && _loc9_ >= 0) {
			rayPoint.x = rayStart.x + _loc9_ * rayEnd.x;
			rayPoint.y = rayStart.y + _loc9_ * rayEnd.y;
			_loc13_ = -(this.p1.y - this.p0.y);
			_loc14_ = this.p1.x - this.p0.x;
			_loc15_ = Math.sqrt(_loc13_ * _loc13_ + _loc14_ * _loc14_);
			_loc13_ /= _loc15_;
			_loc14_ /= _loc15_;
			if (_loc13_ * rayEnd.x + _loc14_ * rayEnd.y > 0) {
				_loc13_ *= -1;
				_loc14_ *= -1;
			}
			outPosition.setFrom(rayPoint);
			outNormal.x = _loc13_;
			outNormal.y = _loc14_;
		}
		return _loc9_;
	}

	debugDraw(gfx: GraphicsManager): void {
		gfx.setStyle("black", 1);
		this.debugDrawNoStyle(gfx);
	}

	debugDrawSimple(gfx: GraphicsManager): void {
		// param1.DrawLine(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
	}

	debugDrawNoStyle(gfx: GraphicsManager): void {
		gfx.renderLine(this.p0, this.p1, "red");
		gfx.renderSquare(this.p0.x, this.p0.y, 2);
		gfx.renderSquare(this.p1.x, this.p1.y, 2);

		const _loc2_ = this.p0.to(this.p1);
		const _loc3_ = _loc2_.perp();
		_loc3_.normalize();
		gfx.renderLine(
			new Vector2(this.p0.x + 0.5 * _loc2_.x, this.p0.y + 0.5 * _loc2_.y),
			new Vector2(
				this.p0.x + 0.5 * _loc2_.x + 4 * _loc3_.x,
				this.p0.y + 0.5 * _loc2_.y + 4 * _loc3_.y
			)
		);
		// param1.DrawLine(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
		// param1.DrawSquare(this.p0.x, this.p0.y, 2);
		// param1.DrawSquare(this.p1.x, this.p1.y, 2);
		// const _loc2_: vec2 = this.p0.To(this.p1);
		// const _loc3_: vec2 = _loc2_.Perp();
		// _loc3_.Normalize();
		// param1.DrawLine(
		// 	this.p0.x + 0.5 * _loc2_.x,
		// 	this.p0.y + 0.5 * _loc2_.y,
		// 	this.p0.x + 0.5 * _loc2_.x + 4 * _loc3_.x,
		// 	this.p0.y + 0.5 * _loc2_.y + 4 * _loc3_.y
		// );
	}
}
