import { NUM_TILE_TYPES, TileType } from "./tile-type";

const edgeStatesX = new Array<number>(NUM_TILE_TYPES * 6);
const edgeStatesY = new Array<number>(NUM_TILE_TYPES * 6);

export const getEdgeStateX = (tileType: TileType, param2: number): number => {
	return edgeStatesX[tileType * 6 + param2];
};

export const getEdgeStateY = (tileType: TileType, param2: number): number => {
	return edgeStatesY[tileType * 6 + param2];
};

function setEdgeStatesX(
	param1: number,
	param2: number,
	param3: number,
	param4: number,
	param5: number,
	param6: number,
	param7: number
): void {
	const _loc8_ = param1 * 6;
	edgeStatesX[_loc8_ + 0] = param2;
	edgeStatesX[_loc8_ + 1] = param3;
	edgeStatesX[_loc8_ + 2] = param4;
	edgeStatesX[_loc8_ + 3] = param5;
	edgeStatesX[_loc8_ + 4] = param6;
	edgeStatesX[_loc8_ + 5] = param7;
}

function setEdgeStatesY(
	param1: number,
	param2: number,
	param3: number,
	param4: number,
	param5: number,
	param6: number,
	param7: number
): void {
	const _loc8_ = param1 * 6;
	edgeStatesY[_loc8_ + 0] = param2;
	edgeStatesY[_loc8_ + 1] = param3;
	edgeStatesY[_loc8_ + 2] = param4;
	edgeStatesY[_loc8_ + 3] = param5;
	edgeStatesY[_loc8_ + 4] = param6;
	edgeStatesY[_loc8_ + 5] = param7;
}

const setEdgeStatesCopy = (param1: number, param2: number): void => {
	const _loc3_ = param1 * 6;
	const _loc4_ = param2 * 6;
	edgeStatesX[_loc4_ + 0] = edgeStatesX[_loc3_ + 0];
	edgeStatesX[_loc4_ + 1] = edgeStatesX[_loc3_ + 1];
	edgeStatesX[_loc4_ + 2] = edgeStatesX[_loc3_ + 2];
	edgeStatesX[_loc4_ + 3] = edgeStatesX[_loc3_ + 3];
	edgeStatesX[_loc4_ + 4] = edgeStatesX[_loc3_ + 4];
	edgeStatesX[_loc4_ + 5] = edgeStatesX[_loc3_ + 5];
	edgeStatesY[_loc4_ + 0] = edgeStatesY[_loc3_ + 0];
	edgeStatesY[_loc4_ + 1] = edgeStatesY[_loc3_ + 1];
	edgeStatesY[_loc4_ + 2] = edgeStatesY[_loc3_ + 2];
	edgeStatesY[_loc4_ + 3] = edgeStatesY[_loc3_ + 3];
	edgeStatesY[_loc4_ + 4] = edgeStatesY[_loc3_ + 4];
	edgeStatesY[_loc4_ + 5] = edgeStatesY[_loc3_ + 5];
};

const setEdgeStatesRotate90 = (param1: number, param2: number): void => {
	const _loc3_ = param1 * 6;
	const _loc4_ = param2 * 6;
	edgeStatesY[_loc4_ + 0] = edgeStatesX[_loc3_ + 3];
	edgeStatesY[_loc4_ + 1] = edgeStatesX[_loc3_ + 4];
	edgeStatesY[_loc4_ + 2] = edgeStatesX[_loc3_ + 5];
	edgeStatesY[_loc4_ + 3] = edgeStatesX[_loc3_ + 0];
	edgeStatesY[_loc4_ + 4] = edgeStatesX[_loc3_ + 1];
	edgeStatesY[_loc4_ + 5] = edgeStatesX[_loc3_ + 2];
	edgeStatesX[_loc4_ + 0] = edgeStatesY[_loc3_ + 2];
	edgeStatesX[_loc4_ + 1] = edgeStatesY[_loc3_ + 1];
	edgeStatesX[_loc4_ + 2] = edgeStatesY[_loc3_ + 0];
	edgeStatesX[_loc4_ + 3] = edgeStatesY[_loc3_ + 5];
	edgeStatesX[_loc4_ + 4] = edgeStatesY[_loc3_ + 4];
	edgeStatesX[_loc4_ + 5] = edgeStatesY[_loc3_ + 3];
};

const setEdgeStatesRotate180 = (param1: number, param2: number): void => {
	const _loc3_ = param1 * 6;
	const _loc4_ = param2 * 6;
	edgeStatesX[_loc4_ + 0] = edgeStatesX[_loc3_ + 5];
	edgeStatesX[_loc4_ + 1] = edgeStatesX[_loc3_ + 4];
	edgeStatesX[_loc4_ + 2] = edgeStatesX[_loc3_ + 3];
	edgeStatesX[_loc4_ + 3] = edgeStatesX[_loc3_ + 2];
	edgeStatesX[_loc4_ + 4] = edgeStatesX[_loc3_ + 1];
	edgeStatesX[_loc4_ + 5] = edgeStatesX[_loc3_ + 0];
	edgeStatesY[_loc4_ + 0] = edgeStatesY[_loc3_ + 5];
	edgeStatesY[_loc4_ + 1] = edgeStatesY[_loc3_ + 4];
	edgeStatesY[_loc4_ + 2] = edgeStatesY[_loc3_ + 3];
	edgeStatesY[_loc4_ + 3] = edgeStatesY[_loc3_ + 2];
	edgeStatesY[_loc4_ + 4] = edgeStatesY[_loc3_ + 1];
	edgeStatesY[_loc4_ + 5] = edgeStatesY[_loc3_ + 0];
};

const setEdgeStatesRotate270 = (param1: number, param2: number): void => {
	const _loc3_ = param1 * 6;
	const _loc4_ = param2 * 6;
	edgeStatesY[_loc4_ + 0] = edgeStatesX[_loc3_ + 2];
	edgeStatesY[_loc4_ + 1] = edgeStatesX[_loc3_ + 1];
	edgeStatesY[_loc4_ + 2] = edgeStatesX[_loc3_ + 0];
	edgeStatesY[_loc4_ + 3] = edgeStatesX[_loc3_ + 5];
	edgeStatesY[_loc4_ + 4] = edgeStatesX[_loc3_ + 4];
	edgeStatesY[_loc4_ + 5] = edgeStatesX[_loc3_ + 3];
	edgeStatesX[_loc4_ + 0] = edgeStatesY[_loc3_ + 3];
	edgeStatesX[_loc4_ + 1] = edgeStatesY[_loc3_ + 4];
	edgeStatesX[_loc4_ + 2] = edgeStatesY[_loc3_ + 5];
	edgeStatesX[_loc4_ + 3] = edgeStatesY[_loc3_ + 0];
	edgeStatesX[_loc4_ + 4] = edgeStatesY[_loc3_ + 1];
	edgeStatesX[_loc4_ + 5] = edgeStatesY[_loc3_ + 2];
};

setEdgeStatesX(TileType.FULL, 2, 0, 2, 2, 0, 2);
setEdgeStatesY(TileType.FULL, 2, 0, 2, 2, 0, 2);
setEdgeStatesY(TileType.EDGE_BOTTOM, 0, 0, 2, 0, 0, 2);
setEdgeStatesRotate90(TileType.EDGE_BOTTOM, TileType.EDGE_LEFT);
setEdgeStatesRotate180(TileType.EDGE_BOTTOM, TileType.EDGE_TOP);
setEdgeStatesRotate270(TileType.EDGE_BOTTOM, TileType.EDGE_RIGHT);
setEdgeStatesX(TileType.HALF_BOTTOM, 0, 0, 0, 2, 0, 2);
setEdgeStatesY(TileType.HALF_BOTTOM, 0, 2, 2, 0, 2, 2);
setEdgeStatesRotate90(TileType.HALF_BOTTOM, TileType.HALF_LEFT);
setEdgeStatesRotate180(TileType.HALF_BOTTOM, TileType.HALF_TOP);
setEdgeStatesRotate270(TileType.HALF_BOTTOM, TileType.HALF_RIGHT);
setEdgeStatesX(TileType.CONCAVE_PP, 2, 0, 1, 2, 1, 0);
setEdgeStatesY(TileType.CONCAVE_PP, 2, 0, 1, 2, 1, 0);
setEdgeStatesRotate90(TileType.CONCAVE_PP, TileType.CONCAVE_NP);
setEdgeStatesRotate180(TileType.CONCAVE_PP, TileType.CONCAVE_NN);
setEdgeStatesRotate270(TileType.CONCAVE_PP, TileType.CONCAVE_PN);
setEdgeStatesX(TileType.CONVEX_PP, 2, 0, 1, 2, 0, 1);
setEdgeStatesY(TileType.CONVEX_PP, 2, 0, 1, 2, 0, 1);
setEdgeStatesRotate90(TileType.CONVEX_PP, TileType.CONVEX_NP);
setEdgeStatesRotate180(TileType.CONVEX_PP, TileType.CONVEX_NN);
setEdgeStatesRotate270(TileType.CONVEX_PP, TileType.CONVEX_PN);
setEdgeStatesCopy(TileType.CONCAVE_PP, TileType.MED_PP);
setEdgeStatesCopy(TileType.CONCAVE_NP, TileType.MED_NP);
setEdgeStatesCopy(TileType.CONCAVE_NN, TileType.MED_NN);
setEdgeStatesCopy(TileType.CONCAVE_PN, TileType.MED_PN);
setEdgeStatesX(TileType.SMALL_22_PP, 2, 0, 1, 0, 0, 0);
setEdgeStatesY(TileType.SMALL_22_PP, 2, 1, 0, 2, 1, 0);
setEdgeStatesRotate90(TileType.SMALL_22_PP, TileType.SMALL_67_NP);
setEdgeStatesRotate180(TileType.SMALL_22_PP, TileType.SMALL_22_NN);
setEdgeStatesRotate270(TileType.SMALL_22_PP, TileType.SMALL_67_PN);
setEdgeStatesX(TileType.SMALL_67_PP, 2, 1, 0, 2, 1, 0);
setEdgeStatesY(TileType.SMALL_67_PP, 2, 0, 1, 0, 0, 0);
setEdgeStatesRotate90(TileType.SMALL_67_PP, TileType.SMALL_22_NP);
setEdgeStatesRotate180(TileType.SMALL_67_PP, TileType.SMALL_67_NN);
setEdgeStatesRotate270(TileType.SMALL_67_PP, TileType.SMALL_22_PN);
setEdgeStatesX(TileType.LARGE_22_PP, 2, 0, 2, 2, 0, 1);
setEdgeStatesY(TileType.LARGE_22_PP, 2, 0, 1, 2, 0, 1);
setEdgeStatesRotate90(TileType.LARGE_22_PP, TileType.LARGE_67_NP);
setEdgeStatesRotate180(TileType.LARGE_22_PP, TileType.LARGE_22_NN);
setEdgeStatesRotate270(TileType.LARGE_22_PP, TileType.LARGE_67_PN);
setEdgeStatesX(TileType.LARGE_67_PP, 2, 0, 1, 2, 0, 1);
setEdgeStatesY(TileType.LARGE_67_PP, 2, 0, 2, 2, 0, 1);
setEdgeStatesRotate90(TileType.LARGE_67_PP, TileType.LARGE_22_NP);
setEdgeStatesRotate180(TileType.LARGE_67_PP, TileType.LARGE_67_NN);
setEdgeStatesRotate270(TileType.LARGE_67_PP, TileType.LARGE_22_PN);
