import type { TileEdgeArchetype } from "../tiles/tile-edge-archetype";
import { TileEdgeArchetypeLinear } from "../tiles/tile-edge-archetype-linear";

export const BoundaryDefinition = new Array<TileEdgeArchetype>(12);

BoundaryDefinition[0] = new TileEdgeArchetypeLinear(-1, -1, -1, 0);
BoundaryDefinition[1] = new TileEdgeArchetypeLinear(-1, 0, -1, 1);
BoundaryDefinition[2] = new TileEdgeArchetypeLinear(-1, -1, -1, 1);
BoundaryDefinition[9] = BoundaryDefinition[1].generatePerpArchetype();
BoundaryDefinition[10] = BoundaryDefinition[0].generatePerpArchetype();
BoundaryDefinition[11] = BoundaryDefinition[2].generatePerpArchetype();
BoundaryDefinition[7] = BoundaryDefinition[10].generatePerpArchetype();
BoundaryDefinition[6] = BoundaryDefinition[9].generatePerpArchetype();
BoundaryDefinition[8] = BoundaryDefinition[11].generatePerpArchetype();
BoundaryDefinition[4] = BoundaryDefinition[6].generatePerpArchetype();
BoundaryDefinition[3] = BoundaryDefinition[7].generatePerpArchetype();
BoundaryDefinition[5] = BoundaryDefinition[8].generatePerpArchetype();
