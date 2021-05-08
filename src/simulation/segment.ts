import type { GraphicsManager } from "../graphics-manager.js";
import type { AABB } from "./aabb.js";
import type { Vector2 } from "./vector2";

export interface Segment {
	getAABB(): AABB;
	getClosestPoint(p1: Vector2, p2: Vector2): void;
	intersectWithRay(
		rayStart: Vector2,
		rayEnd: Vector2,
		outPosition: Vector2,
		outNormal: Vector2
	): number;
	getClosestPointIsBackfacing(p1: Vector2, p2: Vector2): boolean;
	debugDraw(gfx: GraphicsManager): void;
	debugDrawNoStyle(gfx: GraphicsManager): void;
	debugDrawSimple(gfx: GraphicsManager): void;
}
