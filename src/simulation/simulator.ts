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
	numGoldCollectedDuringTick: number[];
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

		// let _loc10_: int = 0;
		// let _loc11_: int = 0;
		// let _loc12_: int = 0;
		// let _loc2_: int = 0;
		// while (_loc2_ < this.num_gold_collected_during_tick.length) {
		// 	this.num_gold_collected_during_tick[_loc2_] = 0;
		// 	_loc2_++;
		// }
		// let _loc3_: int = 0;
		// while (_loc3_ < this.objList.length) {
		// 	this.objList[_loc3_].Move(this);
		// 	_loc3_++;
		// }
		// let _loc4_: int = 0;
		// while (_loc4_ < this.objList.length) {
		// 	this.objList[_loc4_].Think(this);
		// 	_loc4_++;
		// }
		// let _loc5_: int = 0;
		// while (_loc5_ < this.playerList.length) {
		// 	this.playerList[_loc5_].Integrate();
		// 	this.playerList[_loc5_].PreCollision();
		// 	_loc5_++;
		// }

		let _loc8_: int = 0;
		while (_loc8_ < this.playerList.length) {
			this.playerList[_loc8_].PostCollision(this);
			_loc8_++;
		}
		let _loc9_: int = 0;
		while (_loc9_ < this.playerList.length) {
			this.playerList[_loc9_].Think(this, this.frame_num);
			_loc9_++;
		}
		++this.frame_num;
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
		player.kill(x, y, forceX, forceY);
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
}
