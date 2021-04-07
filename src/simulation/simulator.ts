import { NUM_COLS, NUM_ROWS } from "../editor-state";
import type { EntityBase } from "./entities/entity-base";
import type { GridEdges } from "./grid-edges";
import type { GridEntity } from "./grid-entity";
import type { GridSegment } from "./grid-segment";
import type { Ninja } from "./ninja";

export const SimulationRate = 60;

export enum PlayerKillType {
	SUICIDE = 0,
	FALL = 1,
	CRUSH = 2,
	TIME = 3,
	ZAP = 4,
	CHAINGUN = 5,
	LASER = 6,
	TURRET = 7,
	ROCKET = 8,
	FLOOR_GUARD = 9,
	THWOMP = 10,
	MINE = 11,
}

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
	frameNumber: number;
	numGoldCollectedDuringTick: int[];
	stateFlagWon: boolean;

	constructor(
		tileIDs: int[],
		gridSegment: GridSegment,
		edgeGrid: GridEdges,
		entityGrid: GridEntity,
		entityList: EntityBase[],
		playerList: Ninja[]
	) {
		this.tileIDs = tileIDs;
		this.segGrid = gridSegment;
		this.edgeGrid = edgeGrid;
		this.entityGrid = entityGrid;
		this.entityList = entityList;
		this.playerList = playerList;
		this.frameNumber = 0;
		this.numGoldCollectedDuringTick = new Array(playerList.length).fill(0);
		this.stateFlagWon = false;
	}

	killPlayer(
		player: Ninja,
		killType: PlayerKillType,
		x: number,
		y: number,
		forceX: number,
		forceY: number
	): void {
		player.kill(x, y, forceX, forceY);
	}

	exitPlayer(): void {
		this.stateFlagWon = true;
		for (const player of this.playerList) {
			player.win();
		}
	}
}
