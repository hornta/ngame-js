import { GridBase } from "./grid-base";

export class GridEdges extends GridBase {
	edgesTileX: int[];
	edgesTileY: int[];
	edgesDoorX: int[];
	edgesDoorY: int[];

	constructor(numCols: number, numRows: number, cellSize: number) {
		super(numCols, numRows, cellSize);

		this.edgesTileX = new Array(this.numCells).fill(0);
		this.edgesTileY = new Array(this.numCells).fill(0);
		this.edgesDoorX = new Array(this.numCells).fill(0);
		this.edgesDoorY = new Array(this.numCells).fill(0);
	}

	incrementDoorEdge(edgeIndex: number, isHorizontal: boolean): void {
		if (edgeIndex < 0 || edgeIndex >= this.numCells) {
			throw new Error(
				`incrementDoorEdge() was called with an invalid index: ${edgeIndex}`
			);
		}
		if (isHorizontal) {
			this.edgesDoorX[edgeIndex] += 1;
		} else {
			this.edgesDoorY[edgeIndex] += 1;
		}
	}

	decrementDoorEdge(edgeIndex: number, isHorizontal: boolean): void {
		if (edgeIndex < 0 || edgeIndex >= numcells) {
			throw new Error(
				`decrementDoorEdge() was called with an invalid index: ${edgeIndex}`
			);
		}
		if (isHorizontal) {
			if (this.edgesDoorX[edgeIndex] <= 0) {
				throw new Error(
					`decrementDoorEdge() was called on an empty edge! ${edgeIndex}`
				);
			}
			this.edgesDoorX[edgeIndex] = this.edgesDoorX[edgeIndex] - 1;
		} else {
			if (this.edgesDoorY[edgeIndex] <= 0) {
				throw new Error(
					`decrementDoorEdge() was called on an empty edge! ${edgeIndex}`
				);
			}
			this.edgesDoorY[edgeIndex] = this.edgesDoorY[edgeIndex] - 1;
		}
	}
}
