import type { GraphicsManager } from "../../graphics-manager.js";
import type { EntityGraphics } from "../../graphics/entity-graphics.js";
import type { GridEdges } from "../grid-edges.js";
import type { GridEntity } from "../grid-entity.js";
import type { GridSegment } from "../grid-segment.js";
import type { Segment } from "../segment.js";
import type { Simulator } from "../simulator";
import { EntityDoorBase } from "./entity-door-base";

const CLOSE_THRESHOLD = 5;

export class EntityDoorRegular extends EntityDoorBase {
	closeTimer: number;

	constructor(
		entityGrid: GridEntity,
		segmentGrid: GridSegment,
		segmentIndex: number,
		segment: Segment,
		edgeGrid: GridEdges,
		edgeIndicies: number[],
		isHorizontal: boolean,
		x: number,
		y: number
	) {
		const triggerRadius = 12 * (5 / 6);
		super(
			entityGrid,
			segmentGrid,
			segmentIndex,
			segment,
			edgeGrid,
			edgeIndicies,
			isHorizontal,
			x,
			y,
			triggerRadius,
			false
		);
		this.closeTimer = 0;
	}

	onCollision(simulator: Simulator): void {
		this.closeTimer = 0;
		if (!this.isDoorOpen()) {
			this.changeDoorState(true);
		}
	}

	think(simulator: Simulator): void {
		if (this.isDoorOpen()) {
			++this.closeTimer;
			if (CLOSE_THRESHOLD < this.closeTimer) {
				this.changeDoorState(false);
			}
		}
	}

	generateGraphicComponent(): EntityGraphics | null {
		// const _loc1_: vec2 = GetDoorPos();
		// return new EntityGraphics_Door_Regular(
		// 	this,
		// 	_loc1_.x,
		// 	_loc1_.y,
		// 	GetDoorOrn()
		// );
		return null;
	}

	// GFX_UpdateState(param1: EntityGraphics_Door_Regular): void {
	// if (IsDoorOpen()) {
	// 	param1.anim = EntityGraphics_Door_Regular.ANIM_OPEN;
	// } else {
	// 	param1.anim = EntityGraphics_Door_Regular.ANIM_CLOSE;
	// }
	// }

	debugDraw(gfx: GraphicsManager): void {
		// Debug_Draw_Base(param1, true);
		// param1.SetStyle(4, 2263074, 10);
		// seg.DebugDraw_NoStyle(param1);
	}
}
