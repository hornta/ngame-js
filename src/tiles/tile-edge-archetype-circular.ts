import { SegmentCircular } from "src/simulation/segment-circular";

export class TileEdgeArchetypeCircular implements TileEdgeArchetype {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
	x2: number;
	y2: number;

	constructor(
		x0: number,
		y0: number,
		x1: number,
		y1: number,
		x2: number,
		y2: number
	) {
		this.x0 = x0;
		this.y0 = y0;
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}

	generatePerpArchetype(): TileEdgeArchetype {
		return new TileEdgeArchetypeCircular(
			-this.y0,
			this.x0,
			-this.y1,
			this.x1,
			-this.y2,
			this.x2
		);
	}

	generateCollisionSegment(
		param1: number,
		param2: number,
		param3: number
	): Segment {
		return new SegmentCircular(
			param1 + this.x2 * param3,
			param2 + this.y2 * param3,
			param1 + this.x0 * param3,
			param2 + this.y0 * param3,
			param1 + this.x1 * param3,
			param2 + this.y1 * param3
		);
	}
}
