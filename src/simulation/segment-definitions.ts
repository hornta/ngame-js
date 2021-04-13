import { TileType } from "../tile-type";
import { TileEdgeArchetypeCircular } from "../tiles/tile-edge-archetype-circular";
import { TileEdgeArchetypeLinear } from "../tiles/tile-edge-archetype-linear";
import type { TileEdgeArchetype } from "../tiles/tile-edge-archetype.js";

const halfTop = new TileEdgeArchetypeLinear(-1, 0, 1, 0);
const halfRight = halfTop.generatePerpArchetype();
const halfBottom = halfRight.generatePerpArchetype();
const halfLeft = halfBottom.generatePerpArchetype();

const mediumPP = new TileEdgeArchetypeLinear(-1, 1, 1, -1);
const mediumNP = mediumPP.generatePerpArchetype();
const mediumNN = mediumNP.generatePerpArchetype();
const mediumPN = mediumNN.generatePerpArchetype();

const convexPP = new TileEdgeArchetypeCircular(-1, 1, 1, -1, -1, -1);
const convexNP = convexPP.generatePerpArchetype();
const convexNN = convexNP.generatePerpArchetype();
const convexPN = convexNN.generatePerpArchetype();

const concavePP = new TileEdgeArchetypeCircular(-1, 1, 1, -1, 1, 1);
const concaveNP = convexPP.generatePerpArchetype();
const concaveNN = concaveNP.generatePerpArchetype();
const concavePN = concaveNN.generatePerpArchetype();

const small22PP = new TileEdgeArchetypeLinear(-1, 0, 1, -1);
const small67NP = small22PP.generatePerpArchetype();
const small22NN = small67NP.generatePerpArchetype();
const small67PN = small22NN.generatePerpArchetype();

const small67PP = new TileEdgeArchetypeLinear(-1, 1, 0, -1);
const small22NP = small67PP.generatePerpArchetype();
const small67NN = small22NP.generatePerpArchetype();
const small22PN = small67NN.generatePerpArchetype();

const large22PP = new TileEdgeArchetypeLinear(-1, 1, 1, 0);
const large67NP = large22PP.generatePerpArchetype();
const large22NN = large67NP.generatePerpArchetype();
const large67PN = large22NN.generatePerpArchetype();

const large67PP = new TileEdgeArchetypeLinear(0, 1, 1, -1);
const large22NP = large67PP.generatePerpArchetype();
const large67NN = large67NP.generatePerpArchetype();
const large22PN = large67NN.generatePerpArchetype();

export const SegmentDefinition: Record<TileType, TileEdgeArchetype | null> = {
	[TileType.EMPTY]: null,
	[TileType.FULL]: null,
	[TileType.EDGE_TOP]: null,
	[TileType.EDGE_RIGHT]: null,
	[TileType.EDGE_BOTTOM]: null,
	[TileType.EDGE_LEFT]: null,
	[TileType.EDGE_CORNER_UL]: null,
	[TileType.EDGE_CORNER_UR]: null,
	[TileType.EDGE_CORNER_DL]: null,
	[TileType.EDGE_CORNER_DR]: null,
	[TileType.HALF_TOP]: halfTop,
	[TileType.HALF_RIGHT]: halfRight,
	[TileType.HALF_BOTTOM]: halfBottom,
	[TileType.HALF_LEFT]: halfLeft,
	[TileType.MED_PP]: mediumPP,
	[TileType.MED_NP]: mediumNP,
	[TileType.MED_NN]: mediumNN,
	[TileType.MED_PN]: mediumPN,
	[TileType.CONVEX_PP]: convexPP,
	[TileType.CONVEX_NP]: convexNP,
	[TileType.CONVEX_NN]: convexNN,
	[TileType.CONVEX_PN]: convexPN,
	[TileType.CONCAVE_PP]: concavePP,
	[TileType.CONCAVE_NP]: concaveNP,
	[TileType.CONCAVE_NN]: concaveNN,
	[TileType.CONCAVE_PN]: concavePN,
	[TileType.SMALL_22_PP]: small22PP,
	[TileType.SMALL_67_NP]: small67NP,
	[TileType.SMALL_22_NN]: small22NN,
	[TileType.SMALL_67_PN]: small67PN,
	[TileType.SMALL_67_PP]: small67PP,
	[TileType.SMALL_22_NP]: small22NP,
	[TileType.SMALL_67_NN]: small67NN,
	[TileType.SMALL_22_PN]: small22PN,
	[TileType.LARGE_22_PP]: large22PP,
	[TileType.LARGE_67_NP]: large67NP,
	[TileType.LARGE_22_NN]: large22NN,
	[TileType.LARGE_67_PN]: large67PN,
	[TileType.LARGE_67_PP]: large67PP,
	[TileType.LARGE_22_NP]: large22NP,
	[TileType.LARGE_67_NN]: large67NN,
	[TileType.LARGE_22_PN]: large22PN,
};
