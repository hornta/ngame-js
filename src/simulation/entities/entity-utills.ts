import { Vector2 } from "../vector2";

const Direction = {
	RIGHT: 0,
	DOWN: 1,
	LEFT: 2,
	UP: 3,
};

export const DirectionToRadians = {
	[Direction.RIGHT]: 0 * Math.PI,
	[Direction.DOWN]: 0.5 * Math.PI,
	[Direction.LEFT]: 1 * Math.PI,
	[Direction.UP]: 1.5 * Math.PI,
};

export const DirectionToVector = {
	[Direction.RIGHT]: new Vector2(1, 0),
	[Direction.DOWN]: new Vector2(0, 1),
	[Direction.LEFT]: new Vector2(-1, 0),
	[Direction.UP]: new Vector2(0, -1),
};

const MoveType = {
	MOVE_TYPE_SURFACE_CW: 0,
	MOVE_TYPE_SURFACE_CCW: 1,
	MOVE_TYPE_WANDER_CW: 2,
	MOVE_TYPE_WANDER_CCW: 3,
};

const Rotation = {
	ROTATION_0: 0,
	ROTATION_90: 1,
	ROTATION_180: 2,
	ROTATION_270: 3,
};

export const MoveList: number[][] = [];
MoveList[MoveType.MOVE_TYPE_SURFACE_CW] = [
	Rotation.ROTATION_90,
	Rotation.ROTATION_0,
	Rotation.ROTATION_270,
	Rotation.ROTATION_180,
];
MoveList[MoveType.MOVE_TYPE_SURFACE_CCW] = [
	Rotation.ROTATION_270,
	Rotation.ROTATION_0,
	Rotation.ROTATION_90,
	Rotation.ROTATION_180,
];
MoveList[MoveType.MOVE_TYPE_WANDER_CW] = [
	Rotation.ROTATION_0,
	Rotation.ROTATION_90,
	Rotation.ROTATION_270,
	Rotation.ROTATION_180,
];
MoveList[MoveType.MOVE_TYPE_WANDER_CCW] = [
	Rotation.ROTATION_0,
	Rotation.ROTATION_270,
	Rotation.ROTATION_90,
	Rotation.ROTATION_180,
];
