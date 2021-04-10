import { NUM_TILE_TYPES, TileType } from "src/tile-type";
import { TileEdgeArchetype } from "src/tiles/tile-edge-archetype";
import { TileEdgeArchetypeCircular } from "src/tiles/tile-edge-archetype-circular";
import { TileEdgeArchetypeLinear } from "src/tiles/tile-edge-archetype-linear";

export const SegmentDefinition = new Array<TileEdgeArchetype>(NUM_TILE_TYPES);

SegmentDefinition[TileType.EMPTY] = null;
SegmentDefinition[TileType.FULL] = null;
SegmentDefinition[TileType.EDGE_TOP] = null;
SegmentDefinition[TileType.EDGE_RIGHT] = null;
SegmentDefinition[TileType.EDGE_BOTTOM] = null;
SegmentDefinition[TileType.EDGE_LEFT] = null;
SegmentDefinition[TileType.EDGE_CORNER_UL] = null;
SegmentDefinition[TileType.EDGE_CORNER_UR] = null;
SegmentDefinition[TileType.EDGE_CORNER_DL] = null;
SegmentDefinition[TileType.EDGE_CORNER_DR] = null;
SegmentDefinition[TileType.HALF_TOP] = new TileEdgeArchetypeLinear(-1, 0, 1, 0);
SegmentDefinition[TileType.HALF_RIGHT] = SegmentDefinition[
	TileType.HALF_TOP
].generatePerpArchetype();
SegmentDefinition[TileType.HALF_BOTTOM] = SegmentDefinition[
	TileType.HALF_RIGHT
].generatePerpArchetype();
SegmentDefinition[TileType.HALF_LEFT] = SegmentDefinition[
	TileType.HALF_BOTTOM
].generatePerpArchetype();
SegmentDefinition[TileType.MED_PP] = new TileEdgeArchetypeLinear(-1, 1, 1, -1);
SegmentDefinition[TileType.MED_NP] = SegmentDefinition[
	TileType.MED_PP
].generatePerpArchetype();
SegmentDefinition[TileType.MED_NN] = SegmentDefinition[
	TileType.MED_NP
].generatePerpArchetype();
SegmentDefinition[TileType.MED_PN] = SegmentDefinition[
	TileType.MED_NN
].generatePerpArchetype();
SegmentDefinition[TileType.CONVEX_PP] = new TileEdgeArchetypeCircular(
	-1,
	1,
	1,
	-1,
	-1,
	-1
);
SegmentDefinition[TileType.CONVEX_NP] = SegmentDefinition[
	TileType.CONVEX_PP
].generatePerpArchetype();
SegmentDefinition[TileType.CONVEX_NN] = SegmentDefinition[
	TileType.CONVEX_NP
].generatePerpArchetype();
SegmentDefinition[TileType.CONVEX_PN] = SegmentDefinition[
	TileType.CONVEX_NN
].generatePerpArchetype();
SegmentDefinition[TileType.CONCAVE_PP] = new TileEdgeArchetypeCircular(
	-1,
	1,
	1,
	-1,
	1,
	1
);
SegmentDefinition[TileType.CONCAVE_NP] = SegmentDefinition[
	TileType.CONCAVE_PP
].generatePerpArchetype();
SegmentDefinition[TileType.CONCAVE_NN] = SegmentDefinition[
	TileType.CONCAVE_NP
].generatePerpArchetype();
SegmentDefinition[TileType.CONCAVE_PN] = SegmentDefinition[
	TileType.CONCAVE_NN
].generatePerpArchetype();
SegmentDefinition[TileType.SMALL_22_PP] = new TileEdgeArchetypeLinear(
	-1,
	0,
	1,
	-1
);
SegmentDefinition[TileType.SMALL_67_NP] = SegmentDefinition[
	TileType.SMALL_22_PP
].generatePerpArchetype();
SegmentDefinition[TileType.SMALL_22_NN] = SegmentDefinition[
	TileType.SMALL_67_NP
].generatePerpArchetype();
SegmentDefinition[TileType.SMALL_67_PN] = SegmentDefinition[
	TileType.SMALL_22_NN
].generatePerpArchetype();
SegmentDefinition[TileType.SMALL_67_PP] = new TileEdgeArchetypeLinear(
	-1,
	1,
	0,
	-1
);
SegmentDefinition[TileType.SMALL_22_NP] = SegmentDefinition[
	TileType.SMALL_67_PP
].generatePerpArchetype();
SegmentDefinition[TileType.SMALL_67_NN] = SegmentDefinition[
	TileType.SMALL_22_NP
].generatePerpArchetype();
SegmentDefinition[TileType.SMALL_22_PN] = SegmentDefinition[
	TileType.SMALL_67_NN
].generatePerpArchetype();
SegmentDefinition[TileType.LARGE_22_PP] = new TileEdgeArchetypeLinear(
	-1,
	1,
	1,
	0
);
SegmentDefinition[TileType.LARGE_67_NP] = SegmentDefinition[
	TileType.LARGE_22_PP
].generatePerpArchetype();
SegmentDefinition[TileType.LARGE_22_NN] = SegmentDefinition[
	TileType.LARGE_67_NP
].generatePerpArchetype();
SegmentDefinition[TileType.LARGE_67_PN] = SegmentDefinition[
	TileType.LARGE_22_NN
].generatePerpArchetype();
SegmentDefinition[TileType.LARGE_67_PP] = new TileEdgeArchetypeLinear(
	0,
	1,
	1,
	-1
);
SegmentDefinition[TileType.LARGE_22_NP] = SegmentDefinition[
	TileType.LARGE_67_PP
].generatePerpArchetype();
SegmentDefinition[TileType.LARGE_67_NN] = SegmentDefinition[
	TileType.LARGE_22_NP
].generatePerpArchetype();
SegmentDefinition[TileType.LARGE_22_PN] = SegmentDefinition[
	TileType.LARGE_67_NN
].generatePerpArchetype();
