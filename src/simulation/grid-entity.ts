import type { EntityBase } from "./entity-base";
import { GridBase } from "./grid-base";

export class GridEntity extends GridBase {
	cells: EntityBase[][];

	constructor(numCols: number, numRows: number, cellSize: number) {
		super(numCols, numRows, cellSize);

		this.cells = [];
		for (let i = 0; i < this.numCells; ++i) {
			this.cells.push([]);
		}
	}
}
