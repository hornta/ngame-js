import { Vector2 } from "./simulation/vector2";

export const QUANTIZE_STEPS_PER_CELL = 4;
export const QUANTIZE_STEP_SIZE = 6;

export enum EdgeType {
	EMPTY = 0,
	PARTIAL = 1,
	SOLID = 2,
}

export const StructureType = {
	PLAYER: 0,
	MINE: 1,
	GOLD: 2,
	EXIT: 3,
	DOOR_REGULAR: 4,
	DOOR_LOCKED: 5,
	DOOR_TRAP: 6,
	LAUNCHPAD: 7,
	ONEWAY: 8,
	CHAINGUN: 9,
	LASER: 10,
	ZAP: 11,
	CHASER: 12,
	FLOORGUARD: 13,
	BOUNCEBLOCK: 14,
	ROCKET: 15,
	TURRET: 16,
	THWOMP: 17,
};

export const EntityType = {
	PLAYER: 0,
	MINE: 1,
	GOLD: 2,
	DOOR_REGULAR: 3,
	DOOR_LOCKED: 4,
	SWITCH_LOCKED: 5,
	DOOR_TRAP: 6,
	SWITCH_TRAP: 7,
	ONEWAY: 8,
	EXIT_DOOR: 9,
	EXIT_SWITCH: 10,
	CHAINGUN: 11,
	LASER: 12,
	ZAP: 13,
	CHASER: 14,
	FLOORGUARD: 15,
	LAUNCHPAD: 16,
	BOUNCEBLOCK: 17,
	ROCKET: 18,
	TURRET: 19,
	THWOMP: 20,
};

export const StructureSize = {
	[StructureType.PLAYER]: 2,
	[StructureType.MINE]: 2,
	[StructureType.GOLD]: 2,
	[StructureType.EXIT]: 4,
	[StructureType.DOOR_REGULAR]: 3,
	[StructureType.DOOR_LOCKED]: 5,
	[StructureType.DOOR_TRAP]: 5,
	[StructureType.LAUNCHPAD]: 3,
	[StructureType.ONEWAY]: 3,
	[StructureType.CHAINGUN]: 4,
	[StructureType.LASER]: 4,
	[StructureType.ZAP]: 4,
	[StructureType.CHASER]: 4,
	[StructureType.FLOORGUARD]: 2,
	[StructureType.BOUNCEBLOCK]: 2,
	[StructureType.ROCKET]: 2,
	[StructureType.TURRET]: 2,
	[StructureType.THWOMP]: 3,
};

export const StructureToEntity = {
	[StructureType.BOUNCEBLOCK]: EntityType.BOUNCEBLOCK,
	[StructureType.CHAINGUN]: EntityType.CHAINGUN,
	[StructureType.CHASER]: EntityType.CHASER,
	[StructureType.DOOR_LOCKED]: EntityType.DOOR_LOCKED,
	[StructureType.DOOR_REGULAR]: EntityType.DOOR_REGULAR,
	[StructureType.DOOR_TRAP]: EntityType.DOOR_TRAP,
	[StructureType.EXIT]: EntityType.EXIT_DOOR,
	[StructureType.FLOORGUARD]: EntityType.FLOORGUARD,
	[StructureType.GOLD]: EntityType.GOLD,
	[StructureType.LASER]: EntityType.LASER,
	[StructureType.LAUNCHPAD]: EntityType.LAUNCHPAD,
	[StructureType.MINE]: EntityType.MINE,
	[StructureType.ONEWAY]: EntityType.ONEWAY,
	[StructureType.PLAYER]: EntityType.PLAYER,
	[StructureType.ROCKET]: EntityType.ROCKET,
	[StructureType.THWOMP]: EntityType.THWOMP,
	[StructureType.TURRET]: EntityType.TURRET,
	[StructureType.ZAP]: EntityType.ZAP,
};

export enum Direction {
	RIGHT = 0,
	RIGHT_DOWN = 1,
	DOWN = 2,
	LEFT_DOWN = 3,
	LEFT = 4,
	LEFT_UP = 5,
	UP = 6,
	RIGHT_UP = 7,
}

export const DirectionToVector = {
	[Direction.RIGHT]: new Vector2(1, 0),
	[Direction.RIGHT_DOWN]: new Vector2(1 / Math.SQRT2, 1 / Math.SQRT2),
	[Direction.DOWN]: new Vector2(0, 1),
	[Direction.LEFT_DOWN]: new Vector2(-1 / Math.SQRT2, 1 / Math.SQRT2),
	[Direction.LEFT]: new Vector2(-1, 0),
	[Direction.LEFT_UP]: new Vector2(-1 / Math.SQRT2, -1 / Math.SQRT2),
	[Direction.UP]: new Vector2(0, -1),
	[Direction.RIGHT_UP]: new Vector2(1 / Math.SQRT2, -1 / Math.SQRT2),
};
