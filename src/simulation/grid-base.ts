export class GridBase {
	numCols: number;
	numRows: number;
	numCells: number;
	cellSize: number;

	constructor(numCols: number, numRows: number, cellSize: number) {
		this.numCols = numCols;
		this.numRows = numRows;
		this.cellSize = cellSize;
		this.numCells = this.numCols * this.numRows;
	}
}
