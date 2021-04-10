import { SegmentLinear } from "src/simulation/segment-linear";

export class TileEdgeArchetypeLinear implements TileEdgeArchetype {
	x0: number;
	y0: number;
	x1: number;
	y1: number;

	constructor(x0: number, y0: number, x1: number, y1: number) {
		this.x0 = x0;
		this.y0 = y0;
		this.x1 = x1;
		this.y1 = y1;
	}

	generatePerpArchetype(): TileEdgeArchetype {
		return new TileEdgeArchetypeLinear(-this.y0, this.x0, -this.y1, this.x1);
	}

	generateCollisionSegment(
		param1: number,
		param2: number,
		param3: number
	): Segment {
		return new SegmentLinear(
			param1 + this.x0 * param3,
			param2 + this.y0 * param3,
			param1 + this.x1 * param3,
			param2 + this.y1 * param3
		);
	}
}
