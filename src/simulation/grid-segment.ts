import { GridBase } from "./grid-base";
import type { Vector2 } from "./vector2";

export class GridSegment extends GridBase {
	cells: Segment[][];
	tmpRayPosition: Vector2;
	tmpRayVector: Vector2;
	tmpP: Vector2;
	tmpN: Vector2;

	constructor(numCols: number, numRows: number, cellSize: number) {
		super(numCols, numRows, this.cells);

		this.cells = [];
		for (let i = 0; i < this.numCells; ++i) {
			this.cells.push([]);
		}

		this.tmpRayPosition = new Vector2();
		this.tmpRayVector = new Vector2();
		this.tmpP = new Vector2();
		this.tmpN = new Vector2();
	}
}
