import { NUM_COLS, NUM_ROWS } from "../editor-state";
import type { EntityBase } from "./entity-base";

export class Simulator {
	static GRID_NUM_COLUMNS = NUM_COLS + 2;
	static GRID_NUM_ROWS = NUM_ROWS + 2;
	static GRID_CELL_SIZE = 24;
	static GRID_CELL_HALFWIDTH = this.GRID_CELL_SIZE / 2;

	entityList: EntityBase[];
	tileIDs: int[];
	segGrid: GridSegment;
	edgeGrid: GridEdges;
	entityGrid: GridEntity;
	playerList: Ninja[];
}
