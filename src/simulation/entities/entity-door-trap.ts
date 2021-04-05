import type { Simulator } from "../simulator";
import { EntityDoorBase } from "./entity-door-base";

export class EntityDoorRegular extends EntityDoorBase {
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
		const triggerRadius = 12 * (5 / 12);
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
		simulator.entityGrid.removeEntity(this);
		this.changeDoorState(false);
	}

	generateGraphicComponent(): EntityGraphics {
		// const _loc1_: vec2 = GetDoorPos();
		// return new EntityGraphics_Door_Trap(
		// 	this,
		// 	_loc1_.x,
		// 	_loc1_.y,
		// 	GetDoorOrn(),
		// 	trigger_pos.x,
		// 	trigger_pos.y
		// );
	}

	GFX_UpdateState(param1: EntityGraphics_Door_Trap): void {
		// if (IsDoorOpen()) {
		// 	param1.anim = EntityGraphics_Door_Trap.ANIM_OPEN;
		// } else {
		// 	param1.anim = EntityGraphics_Door_Trap.ANIM_CLOSE;
		// }
	}

	Debug_Draw(param1: SimpleRenderer): void {
		// Debug_Draw_Base(param1, IsDoorOpen());
		// param1.SetStyle(4, 8921634, 10);
		// seg.DebugDraw_NoStyle(param1);
	}
}
