import { NUM_TILE_TYPES, TileType } from "src/tile-type";

const perpIndex = [2, 3, 5, 4, 6, 7, 1, 0];

export const BoundaryFlags = new Array<boolean[]>(NUM_TILE_TYPES).fill(
	new Array<boolean>(8).fill(false)
);

const setBoundaryFlagsPerp = (param1: number, param2: number): void => {
	for (let i = 0; i < 8; ++i) {
		BoundaryFlags[param2][i] = BoundaryFlags[param1][perpIndex[i]];
	}
};

const setBoundaryFlagsCopy = (param1: number, param2: number): void => {
	for (let i = 0; i < 8; ++i) {
		BoundaryFlags[param2][i] = BoundaryFlags[param1][i];
	}
};

BoundaryFlags[TileType.FULL][0] = true;
BoundaryFlags[TileType.FULL][1] = true;
BoundaryFlags[TileType.FULL][2] = true;
BoundaryFlags[TileType.FULL][3] = true;
BoundaryFlags[TileType.FULL][4] = true;
BoundaryFlags[TileType.FULL][5] = true;
BoundaryFlags[TileType.FULL][6] = true;
BoundaryFlags[TileType.FULL][7] = true;
BoundaryFlags[TileType.EDGE_TOP][6] = true;
BoundaryFlags[TileType.EDGE_TOP][7] = true;
setBoundaryFlagsPerp(TileType.EDGE_TOP, TileType.EDGE_RIGHT);
setBoundaryFlagsPerp(TileType.EDGE_RIGHT, TileType.EDGE_BOTTOM);
setBoundaryFlagsPerp(TileType.EDGE_BOTTOM, TileType.EDGE_LEFT);
BoundaryFlags[TileType.HALF_TOP][0] = true;
BoundaryFlags[TileType.HALF_TOP][4] = true;
BoundaryFlags[TileType.HALF_TOP][6] = true;
BoundaryFlags[TileType.HALF_TOP][7] = true;
setBoundaryFlagsPerp(TileType.HALF_TOP, TileType.HALF_RIGHT);
setBoundaryFlagsPerp(TileType.HALF_RIGHT, TileType.HALF_BOTTOM);
setBoundaryFlagsPerp(TileType.HALF_BOTTOM, TileType.HALF_LEFT);
BoundaryFlags[TileType.MED_PP][0] = true;
BoundaryFlags[TileType.MED_PP][1] = true;
BoundaryFlags[TileType.MED_PP][6] = true;
BoundaryFlags[TileType.MED_PP][7] = true;
setBoundaryFlagsPerp(TileType.MED_PP, TileType.MED_NP);
setBoundaryFlagsPerp(TileType.MED_NP, TileType.MED_NN);
setBoundaryFlagsPerp(TileType.MED_NN, TileType.MED_PN);
setBoundaryFlagsCopy(TileType.MED_PP, TileType.CONVEX_PP);
setBoundaryFlagsCopy(TileType.MED_NP, TileType.CONVEX_NP);
setBoundaryFlagsCopy(TileType.MED_NN, TileType.CONVEX_NN);
setBoundaryFlagsCopy(TileType.MED_PN, TileType.CONVEX_PN);
setBoundaryFlagsCopy(TileType.MED_PP, TileType.CONCAVE_PP);
setBoundaryFlagsCopy(TileType.MED_NP, TileType.CONCAVE_NP);
setBoundaryFlagsCopy(TileType.MED_NN, TileType.CONCAVE_NN);
setBoundaryFlagsCopy(TileType.MED_PN, TileType.CONCAVE_PN);
BoundaryFlags[TileType.SMALL_22_PP][0] = true;
BoundaryFlags[TileType.SMALL_22_PP][6] = true;
BoundaryFlags[TileType.SMALL_22_PP][7] = true;
setBoundaryFlagsPerp(TileType.SMALL_22_PP, TileType.SMALL_67_NP);
setBoundaryFlagsPerp(TileType.SMALL_67_NP, TileType.SMALL_22_NN);
setBoundaryFlagsPerp(TileType.SMALL_22_NN, TileType.SMALL_67_PN);
BoundaryFlags[TileType.SMALL_67_PP][0] = true;
BoundaryFlags[TileType.SMALL_67_PP][1] = true;
BoundaryFlags[TileType.SMALL_67_PP][6] = true;
setBoundaryFlagsPerp(TileType.SMALL_67_PP, TileType.SMALL_22_NP);
setBoundaryFlagsPerp(TileType.SMALL_22_NP, TileType.SMALL_67_NN);
setBoundaryFlagsPerp(TileType.SMALL_67_NN, TileType.SMALL_22_PN);
BoundaryFlags[TileType.LARGE_22_PP][0] = true;
BoundaryFlags[TileType.LARGE_22_PP][1] = true;
BoundaryFlags[TileType.LARGE_22_PP][4] = true;
BoundaryFlags[TileType.LARGE_22_PP][6] = true;
BoundaryFlags[TileType.LARGE_22_PP][7] = true;
setBoundaryFlagsPerp(TileType.LARGE_22_PP, TileType.LARGE_67_NP);
setBoundaryFlagsPerp(TileType.LARGE_67_NP, TileType.LARGE_22_NN);
setBoundaryFlagsPerp(TileType.LARGE_22_NN, TileType.LARGE_67_PN);
BoundaryFlags[TileType.LARGE_67_PP][0] = true;
BoundaryFlags[TileType.LARGE_67_PP][1] = true;
BoundaryFlags[TileType.LARGE_67_PP][2] = true;
BoundaryFlags[TileType.LARGE_67_PP][6] = true;
BoundaryFlags[TileType.LARGE_67_PP][7] = true;
setBoundaryFlagsPerp(TileType.LARGE_67_PP, TileType.LARGE_22_NP);
setBoundaryFlagsPerp(TileType.LARGE_22_NP, TileType.LARGE_67_NN);
setBoundaryFlagsPerp(TileType.LARGE_67_NN, TileType.LARGE_22_PN);
