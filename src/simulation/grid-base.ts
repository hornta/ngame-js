import { Vector2 } from "./vector2.js";

export abstract class GridBase {
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

	worldspaceToGridspace(position: number): number {
		return Math.floor(position / this.cellSize);
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
			y = Math.max(0, Math.min(this.numRows - 1, y));
		}
		return y * this.numCols + x;
	}

	public debugGetWorldspaceCellCenterPositionFromIndex(id: number): Vector2 {
		const x = id % this.numCols;
		const y = Math.floor(id / this.numCols);

		return new Vector2((x + 0.5) * this.cellSize, (y + 0.5) * this.cellSize);
	}
}
