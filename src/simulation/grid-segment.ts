import { GridBase } from "./grid-base";
import type { Segment } from "./segment";
import type { Vector2 } from "./vector2";

export class GridSegment extends GridBase {
	cells: Segment[][];
	tmpRayPosition: Vector2;
	tmpRayVector: Vector2;
	tmpP: Vector2;
	tmpN: Vector2;

	constructor(numCols: number, numRows: number, cellSize: number) {
		super(numCols, numRows, cellSize);

		this.cells = [];
		for (let i = 0; i < this.numCells; ++i) {
			this.cells.push([]);
		}

		this.tmpRayPosition = new Vector2();
		this.tmpRayVector = new Vector2();
		this.tmpP = new Vector2();
		this.tmpN = new Vector2();
	}

	addDoorSegment(segmentIndex: number, segment: Segment): void {
		if (segmentIndex < 0 || segmentIndex >= this.numCells) {
			throw new Error(
				`addDoorSegment() was called with an invalid index: ${segmentIndex}`
			);
		}

		const cellSegments: Segment[] = this.cells[segmentIndex];

		if (cellSegments.includes(cellSegments)) {
			throw new Error(
				`addDoorSegment() was passed an already-in-grid seg: ${segmentIndex}`
			);
		} else {
			cellSegments.push(segment);
		}
	}

	removeDoorSegment(segmentIndex: number, segment: Segment): void {
		if (segmentIndex < 0 || segmentIndex >= numcells) {
			throw new Error(
				`removeDoorSegment() was called with an invalid index: ${segmentIndex}`
			);
		}
		const cellSegments: Segment[] = this.cells[segmentIndex];
		if (!cellSegments.includes(param2)) {
			throw new Error(
				`removeDoorSegment() couldn't find a seg: ${segmentIndex}`
			);
		} else {
			cellSegments.splice(cellSegments.indexOf(segment), 1);
		}
	}
}
