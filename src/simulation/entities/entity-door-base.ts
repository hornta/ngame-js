import { overlapCircleVsCircle } from "src/fns";
import type { CollisionResultLogical } from "../collision-result-logical";
import type { GridEdges } from "../grid-edges";
import type { GridEntity } from "../grid-entity";
import type { GridSegment } from "../grid-segment";
import type { Segment } from "../segment";
import type { Vector2 } from "../vector2";
import { EntityBase } from "./entity-base";

export abstract class EntityDoorBase extends EntityBase {
	triggerPosition: Vector2;
	triggerRadius: number;
	segmentGrid: GridSegment;
	segment: Segment;
	segmentIndex: number;
	edgeGrid: GridEdges;
	edgeIndicies: number[];
	isHorizontal: boolean;
	isOpen: boolean;

	constructor(
		entityGrid: GridEntity,
		segmentGrid: GridSegment,
		segmentIndex: number,
		segment: Segment,
		edgeGrid: GridEdges,
		edgeIndicies: number[],
		isHorizontal: boolean,
		x: number,
		y: number,
		triggerRadius: number,
		isOpen: boolean
	) {
		this.triggerPosition = new Vector2(x, y);
		this.triggerRadius = triggerRadius;
		this.segmentGrid = segmentGrid;
		this.segmentIndex = segmentIndex;
		this.segment = segment;
		this.edgeGrid = edgeGrid;
		this.isHorizontal = isHorizontal;
		this.isOpen = isOpen;
		for (const edgeIndex of edgeIndicies) {
			this.edgeIndicies.push(edgeIndex);
		}

		if (!this.isOpen) {
			this.addDoorToWorld();
		}

		entityGrid.addEntity(this.triggerPosition, this);
	}

	collideVsCircleLogical(
		simulator: Simulator,
		ninja: Ninja,
		collision: CollisionResultLogical,
		position: Vector2,
		param5: Vector2,
		param6: Vector2,
		radius: number,
		param8: number
	): boolean {
		if (ninja != null) {
			if (
				overlapCircleVsCircle(
					this.triggerPosition,
					this.triggerRadius,
					position,
					radius
				)
			) {
				this.onCollision(param1);
			}
		}
		return false;
	}

	abstract onCollision(simulator: Simulator): void;

	isDoorOpen(): boolean {
		return this.isOpen;
	}

	changeDoorState(newState: boolean): void {
		if (this.isOpen === newState) {
			throw new Error(
				`changeDoorState() was called with the existing state as new! ${newState}`
			);
		}
		this.isOpen = newState;
		if (this.isOpen) {
			this.removeDoorFromWorld();
		} else {
			this.addDoorToWorld();
		}
	}

	removeDoorFromWorld(): void {
		this.segmentGrid.removeDoorSegment(this.seg_index, this.seg);
		for (const edgeIndex of this.edgeIndicies) {
			this.edgeGrid.decrementDoorEdge(edgeIndex, this.isHorizontal);
		}
	}

	addDoorToWorld(): void {
		this.segmentGrid.addDoorSegment(this.seg_index, this.seg);
		for (const edgeIndex of this.edgeIndicies) {
			this.edgeGrid.incrementDoorEdge(edgeIndex, this.isHorizontal);
		}
	}

	getDoorPosition(): Vector2 {
		const aabb = this.segment.getAABB();
		return new Vector2(
			0.5 * (aabb.min.x + aabb.max.x),
			0.5 * (aabb.min.y + aabb.max.y)
		);
	}

	getDoorOrientation(): number {
		if (this.isHorizontal) {
			return 0;
		}
		return Math.PI / 2;
	}
}
