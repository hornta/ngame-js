import type { AABB } from "./AABB";
import type { Vector2 } from "./vector2";

export interface Segment {
	getAABB(): AABB;
	getClosestPoint(p1: Vector2, p2: Vector2): void;
	intersectWithRay(
		p1: Vector2,
		p2: Vector2,
		p3: number,
		p4: Vector2,
		p5: Vector2
	): number;
	getClosestPointIsBackfacing(p1: Vector2, p2: Vector2): boolean;
	DebugDraw(context: CanvasRenderingContext2D): void;
	DebugDraw_NoStyle(context: CanvasRenderingContext2D): void;
	DebugDraw_Simple(context: CanvasRenderingContext2D): void;
}
