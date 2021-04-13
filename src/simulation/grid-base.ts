import type { Vector2 } from "./vector2";

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

	worldspaceToGridspace(param1: number): number {
		return Math.floor(param1 / this.cellSize);
	}

	getCellIndexFromWorldspacePosition(x: number, y: number): number {
		return this.getCellIndexFromGridspacePosition(
			this.worldspaceToGridspace(x),
			this.worldspaceToGridspace(y)
		);
	}

	getCellIndexFromGridspacePosition(x: number, y: number): number {
		if (x < 0 || x >= this.numCols || y < 0 || y >= this.numRows) {
			x = Math.max(0, Math.min(this.numCols - 1, x));
			y = Math.max(0, Math.min(this.numCols - 1, y));
		}
		return y * this.numCols + x;
	}
}
