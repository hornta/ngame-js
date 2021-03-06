import type { Segment } from "../simulation/segment.js";

export interface TileEdgeArchetype {
	generatePerpArchetype(): TileEdgeArchetype;
	generateCollisionSegment(
		param1: number,
		param2: number,
		param3: number
	): Segment;
}
