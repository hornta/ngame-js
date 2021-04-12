import { TileType } from "../tile-type";
import { TileEdgeArchetype } from "../tiles/tile-edge-archetype";
import { TileEdgeArchetypeCircular } from "../tiles/tile-edge-archetype-circular";
import { TileEdgeArchetypeLinear } from "../tiles/tile-edge-archetype-linear";

export const SegmentDefinition: Record<TileType, TileEdgeArchetype | null> = {};

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

const halfTop = new TileEdgeArchetypeLinear(-1, 0, 1, 0);
const halfRight = halfTop.generatePerpArchetype();
const halfBottom = halfRight.generatePerpArchetype();
const halfLeft = halfBottom.generatePerpArchetype();
SegmentDefinition[TileType.HALF_TOP] = halfTop;
SegmentDefinition[TileType.HALF_RIGHT] = halfRight;
SegmentDefinition[TileType.HALF_BOTTOM] = halfBottom;
SegmentDefinition[TileType.HALF_LEFT] = halfLeft;

const mediumPP = new TileEdgeArchetypeLinear(-1, 1, 1, -1);
const mediumNP = mediumPP.generatePerpArchetype();
const mediumNN = mediumNP.generatePerpArchetype();
const mediumPN = mediumNN.generatePerpArchetype();
SegmentDefinition[TileType.MED_PP] = mediumPP;
SegmentDefinition[TileType.MED_NP] = mediumNP;
SegmentDefinition[TileType.MED_NN] = mediumNN;
SegmentDefinition[TileType.MED_PN] = mediumPN;

const convexPP = new TileEdgeArchetypeCircular(-1, 1, 1, -1, -1, -1);
const convexNP = convexPP.generatePerpArchetype();
const convexNN = convexNP.generatePerpArchetype();
const convexPN = convexNN.generatePerpArchetype();
SegmentDefinition[TileType.CONVEX_PP] = convexPP;
SegmentDefinition[TileType.CONVEX_NP] = convexNP;
SegmentDefinition[TileType.CONVEX_NN] = convexNN;
SegmentDefinition[TileType.CONVEX_PN] = convexPN;

const concavePP = new TileEdgeArchetypeCircular(-1, 1, 1, -1, 1, 1);
const concaveNP = convexPP.generatePerpArchetype();
const concaveNN = concaveNP.generatePerpArchetype();
const concavePN = concaveNN.generatePerpArchetype();

SegmentDefinition[TileType.CONCAVE_PP] = concavePP;
SegmentDefinition[TileType.CONCAVE_NP] = concaveNP;
SegmentDefinition[TileType.CONCAVE_NN] = concaveNN;
SegmentDefinition[TileType.CONCAVE_PN] = concavePN;

const small22PP = new TileEdgeArchetypeLinear(-1, 0, 1, -1);
const small67NP = small22PP.generatePerpArchetype();
const small22NN = small67NP.generatePerpArchetype();
const small67PN = small22NN.generatePerpArchetype();

SegmentDefinition[TileType.SMALL_22_PP] = small22PP;
SegmentDefinition[TileType.SMALL_67_NP] = small67NP;
SegmentDefinition[TileType.SMALL_22_NN] = small22NN;
SegmentDefinition[TileType.SMALL_67_PN] = small67PN;

const small67PP = new TileEdgeArchetypeLinear(-1, 1, 0, -1);
const small22NP = small67PP.generatePerpArchetype();
const small67NN = small22NP.generatePerpArchetype();
const small22PN = small67NN.generatePerpArchetype();

SegmentDefinition[TileType.SMALL_67_PP] = small67PP;
SegmentDefinition[TileType.SMALL_22_NP] = small22NP;
SegmentDefinition[TileType.SMALL_67_NN] = small67NN;
SegmentDefinition[TileType.SMALL_22_PN] = small22PN;

const large22PP = new TileEdgeArchetypeLinear(-1, 1, 1, 0);
const large67NP = large22PP.generatePerpArchetype();
const large22NN = large67NP.generatePerpArchetype();
const large67PN = large22NN.generatePerpArchetype();

SegmentDefinition[TileType.LARGE_22_PP] = large22PP;
SegmentDefinition[TileType.LARGE_67_NP] = large67NP;
SegmentDefinition[TileType.LARGE_22_NN] = large22NN;
SegmentDefinition[TileType.LARGE_67_PN] = large67PN;

const large67PP = new TileEdgeArchetypeLinear(0, 1, 1, -1);
const large22NP = large67PP.generatePerpArchetype();
const large67NN = large67NP.generatePerpArchetype();
const large22PN = large67NN.generatePerpArchetype();

SegmentDefinition[TileType.LARGE_67_PP] = large67PP;
SegmentDefinition[TileType.LARGE_22_NP] = large22NP;
SegmentDefinition[TileType.LARGE_67_NN] = large67NN;
SegmentDefinition[TileType.LARGE_22_PN] = large22PN;
