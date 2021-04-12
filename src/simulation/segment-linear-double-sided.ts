import { SegmentLinear } from "./segment-linear";
import type { Vector2 } from "./vector2";

export class SegmentLinearDoubleSided extends SegmentLinear {
	getClosestPointIsBackfacing(param1: Vector2, param2: Vector2): boolean {
		super.getClosestPointIsBackfacing(param1, param2);
		return false;
	}

	// override public function DebugDraw_NoStyle(param1:SimpleRenderer) : void
	//     {
	//        param1.DrawLine(p0.x,p0.y,p1.x,p1.y);
	//        param1.DrawSquare(p0.x,p0.y,2);
	//        param1.DrawSquare(p1.x,p1.y,2);
	//        var _loc2_:vec2 = p0.To(p1);
	//        var _loc3_:vec2 = _loc2_.Perp();
	//        _loc3_.Normalize();
	//        param1.DrawLine(p0.x + 0.5 * _loc2_.x,p0.y + 0.5 * _loc2_.y,p0.x + 0.5 * _loc2_.x + 4 * _loc3_.x,p0.y + 0.5 * _loc2_.y + 4 * _loc3_.y);
	//        param1.DrawLine(p0.x + 0.5 * _loc2_.x,p0.y + 0.5 * _loc2_.y,p0.x + 0.5 * _loc2_.x - 4 * _loc3_.x,p0.y + 0.5 * _loc2_.y - 4 * _loc3_.y);
	//     }
}
