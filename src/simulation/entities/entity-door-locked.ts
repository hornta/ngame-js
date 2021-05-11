import type { GraphicsManager } from "../../graphics-manager.js";
import type { EntityGraphics } from "../../graphics/entity-graphics.js";
import type { GridEdges } from "../grid-edges.js";
import type { GridEntity } from "../grid-entity.js";
import type { GridSegment } from "../grid-segment.js";
import type { Segment } from "../segment.js";
import type { Simulator } from "../simulator";
import type { Vector2 } from "../vector2.js";
import { EntityDoorBase } from "./entity-door-base";

export class EntityDoorLocked extends EntityDoorBase {
	constructor(
		entityGrid: GridEntity,
		segmentGrid: GridSegment,
		segmentIndex: number,
		segment: Segment,
		edgeGrid: GridEdges,
		edgeIndicies: number[],
		isHorizontal: boolean,
		position: Vector2
	) {
		const triggerRadius = 12 * (5 / 12);
		super(
			entityGrid,
			segmentGrid,
			segmentIndex,
			segment,
			edgeGrid,
			edgeIndicies,
			isHorizontal,
			position,
			triggerRadius,
			false
		);
	}

	onCollision(simulator: Simulator): void {
		simulator.entityGrid.removeEntity(this);
		this.changeDoorState(true);
	}

	generateGraphicComponent(): EntityGraphics | null {
		// const _loc1_: vec2 = GetDoorPos();
		// return new EntityGraphics_Door_Locked(
		// 	this,
		// 	_loc1_.x,
		// 	_loc1_.y,
		// 	GetDoorOrn(),
		// 	trigger_pos.x,
		// 	trigger_pos.y
		// );
		return null;
	}

	// GFX_UpdateState(param1: EntityGraphics_Door_Locked): void {
	// if (this.isDoorOpen()) {
	// 	param1.anim = EntityGraphics_Door_Locked.ANIM_OPEN;
	// } else {
	// 	param1.anim = EntityGraphics_Door_Locked.ANIM_CLOSE;
	// }
	// }

	debugDraw(gfx: GraphicsManager): void {
		// Debug_Draw_Base(param1, !IsDoorOpen());
		// param1.SetStyle(4, 2237064, 10);
		// seg.DebugDraw_NoStyle(param1);
	}
}
