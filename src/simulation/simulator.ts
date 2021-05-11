import { NUM_COLS, NUM_ROWS } from "../editor-state";
import type { GraphicsManager } from "../graphics-manager.js";
import type { TileType } from "../tile-type.js";
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

export enum PlayerDeathType {
	SUICIDE = 0,
	FALL = 1,
	CRUSH = 2,
	TIME = 3,
	EXPLOSIVE = 4,
	LASER = 5,
	ELECTRIC = 6,
	BULLET = 7,
}

export const PlayerKillTypeToDeathType: Record<
	PlayerKillType,
	PlayerDeathType
> = {
	[PlayerKillType.SUICIDE]: PlayerDeathType.EXPLOSIVE,
	[PlayerKillType.FALL]: PlayerDeathType.FALL,
	[PlayerKillType.CRUSH]: PlayerDeathType.CRUSH,
	[PlayerKillType.TIME]: PlayerDeathType.EXPLOSIVE,
	[PlayerKillType.ROCKET]: PlayerDeathType.EXPLOSIVE,
	[PlayerKillType.MINE]: PlayerDeathType.EXPLOSIVE,
	[PlayerKillType.LASER]: PlayerDeathType.LASER,
	[PlayerKillType.ZAP]: PlayerDeathType.ELECTRIC,
	[PlayerKillType.FLOOR_GUARD]: PlayerDeathType.ELECTRIC,
	[PlayerKillType.THWOMP]: PlayerDeathType.ELECTRIC,
	[PlayerKillType.CHAINGUN]: PlayerDeathType.BULLET,
	[PlayerKillType.TURRET]: PlayerDeathType.BULLET,
};

export class Simulator {
	static GRID_NUM_COLUMNS = NUM_COLS + 2;
	static GRID_NUM_ROWS = NUM_ROWS + 2;
	static GRID_CELL_SIZE = 24;
	static GRID_CELL_HALFWIDTH = 12;

	entityList: EntityBase[];
	tileIDs: TileType[];
	segGrid: GridSegment;
	edgeGrid: GridEdges;
	entityGrid: GridEntity;
	playerList: Ninja[];
	frameNumber: number;
	numGoldCollectedDuringTick: number[];
	stateFlagWon: boolean;

	constructor(
		tileIDs: number[],
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
		this.numGoldCollectedDuringTick = new Array<number>(playerList.length).fill(
			0
		);
		this.stateFlagWon = false;
	}

	tick(): void {
		this.numGoldCollectedDuringTick.fill(0);

		for (const entity of this.entityList) {
			entity.move(this);
		}

		for (const entity of this.entityList) {
			entity.think(this);
		}

		for (const player of this.playerList) {
			player.integrate();
			player.preCollision();
		}

		for (let i = 0; i < 4; ++i) {
			for (const player of this.playerList) {
				player.solveInternalConstraints();
			}
			for (const player of this.playerList) {
				player.collideVsObjects(this);
			}
			for (const player of this.playerList) {
				player.collideVsTiles(this);
			}
		}

		for (const player of this.playerList) {
			player.postCollision(this);
		}

		for (const player of this.playerList) {
			player.think(this, this.frameNumber);
		}

		++this.frameNumber;
	}

	timeIsUp(): void {
		for (const player of this.playerList) {
			this.killPlayer(player, PlayerKillType.TIME, 0, 0, 0, 0);
		}
	}

	getNumGoldCollectedDuringTick(playerIndex: number): number {
		return this.numGoldCollectedDuringTick[playerIndex];
	}

	killPlayer(
		player: Ninja,
		killType: PlayerKillType,
		x: number,
		y: number,
		forceX: number,
		forceY: number
	): void {
		player.kill(killType, x, y, forceX, forceY);
	}

	private areAllPlayersDead(): boolean {
		for (const player of this.playerList) {
			if (!player.isDead()) {
				return false;
			}
		}
		return true;
	}

	isGameDone(): boolean {
		return this.stateFlagWon || this.areAllPlayersDead();
	}

	didPlayerWin(): boolean {
		if (!this.isGameDone()) {
			throw new Error(
				"Simulator.didPlayerWin() was called, but isGameDone() wasn't consulted -- check it FIRST!"
			);
		}
		if (this.stateFlagWon) {
			return true;
		}
		return false;
	}

	enablePlayer(playerIndex: number): void {
		this.playerList[playerIndex].enable();
	}

	exitPlayer(): void {
		this.stateFlagWon = true;
		for (const player of this.playerList) {
			player.win();
		}
	}

	isPlayerDead(playerIndex: number): boolean {
		return this.playerList[playerIndex].isDead();
	}

	suicidePlayer(playerIndex: number): void {
		this.killPlayer(
			this.playerList[playerIndex],
			PlayerKillType.SUICIDE,
			0,
			0,
			0,
			0
		);
	}

	public launchPlayer(ninja: Ninja, param2: number, param3: number): void {
		ninja.launch(param2, param3);
	}

	public goldHitPlayer(ninja: Ninja): boolean {
		if (!this.stateFlagWon) {
			++this.numGoldCollectedDuringTick[ninja.getIndex()];
			return true;
		}
		return false;
	}

	public debugDraw(gfx: GraphicsManager): void {
		this.segGrid.debugDraw(gfx);
		this.edgeGrid.debugDraw(gfx);
		for (const entity of this.entityList) {
			entity.debugDraw(gfx);
		}
		for (const player of this.playerList) {
			player.debugDraw(gfx);
		}
	}
}
