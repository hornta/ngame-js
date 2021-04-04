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
}
