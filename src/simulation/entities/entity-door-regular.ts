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
		this.closeTimer = 0;
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

	generateGraphicComponent(): EntityGraphics {
		// const _loc1_: vec2 = GetDoorPos();
		// return new EntityGraphics_Door_Regular(
		// 	this,
		// 	_loc1_.x,
		// 	_loc1_.y,
		// 	GetDoorOrn()
		// );
	}

	GFX_UpdateState(param1: EntityGraphics_Door_Regular): void {
		// if (IsDoorOpen()) {
		// 	param1.anim = EntityGraphics_Door_Regular.ANIM_OPEN;
		// } else {
		// 	param1.anim = EntityGraphics_Door_Regular.ANIM_CLOSE;
		// }
	}

	Debug_Draw(param1: SimpleRenderer): void {
		// Debug_Draw_Base(param1, true);
		// param1.SetStyle(4, 2263074, 10);
		// seg.DebugDraw_NoStyle(param1);
	}
}
