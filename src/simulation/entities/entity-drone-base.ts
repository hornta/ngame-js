import { wrapAngleShortest, wrapAnglePosition } from "../../fns";
import type { GridEdges } from "../grid-edges";
import type { GridEntity } from "../grid-entity";
import type { GridSegment } from "../grid-segment";
import type { Simulator } from "../simulator";
import { Vector2 } from "../vector2.js";
import { EntityBase } from "./entity-base.js";
import {
	EntityDroneDirectionToRadians,
	EntityDroneDirectionToVector,
	EntityDroneMoveList,
} from "./entity-drone-utils";

export class EntityDroneBase extends EntityBase {
	position: Vector2;
	speed: number;
	radius: number;
	gfxOrientation: number;
	stepSize: number;
	nextGoal: Vector2;
	facingDirection: number;
	moveType: number;

	constructor(
		entityGrid: GridEntity,
		x: number,
		y: number,
		speed: number,
		facingDirection: number,
		moveType: number
	) {
		super();
		this.position = new Vector2(x, y);
		this.radius = 12 * (3 / 4);
		this.speed = speed;
		this.stepSize = 24;
		this.nextGoal = this.position.clone();
		this.facingDirection = facingDirection;
		this.moveType = moveType;
		this.gfxOrientation = EntityDroneDirectionToRadians[this.facingDirection];
		entityGrid.addEntity(this.position, this);
	}

	move(simulator: Simulator): void {
		this.moveForward(
			simulator.edgeGrid,
			simulator.segGrid,
			simulator.entityGrid
		);
		const radians = EntityDroneDirectionToRadians[this.facingDirection];
		const shortestAngle = wrapAngleShortest(radians - this.gfxOrientation);
		this.gfxOrientation = wrapAnglePosition(
			this.gfxOrientation + 0.3 * shortestAngle
		);
	}

	moveForward(
		edgeGrid: GridEdges,
		segmentGrid: GridSegment,
		entityGrid: GridEntity
	): void {
		const directionVec = EntityDroneDirectionToVector[this.facingDirection];
		const _loc6_ = directionVec.x * this.speed;
		const _loc7_ = directionVec.y * this.speed;
		const _loc8_ = this.position.x + _loc6_;
		const _loc9_ = this.position.y + _loc7_;
		const diffX = this.nextGoal.x - this.position.x;
		const diffY = this.nextGoal.y - this.position.y;
		const _loc12_ = this.nextGoal.x - _loc8_;
		const _loc13_ = this.nextGoal.y - _loc9_;
		const distanceSquared = Math.sqrt(diffX * diffX + diffY * diffY);
		const _loc15_ = diffX * _loc12_ + diffY * _loc13_;
		if (distanceSquared < 0.000001 || _loc15_ < 0) {
			this.position.setFrom(this.nextGoal);
			if (this.chooseNextDirectionAndGoal(edgeGrid)) {
				const _loc16_ = Math.max(0, this.speed - distanceSquared);
				const _loc17_ = EntityDroneDirectionToVector[this.facingDirection];
				this.position.x += _loc17_.x * _loc16_;
				this.position.y += _loc17_.y * _loc16_;
			}
		} else {
			this.position.x += _loc6_;
			this.position.y += _loc7_;
		}
		entityGrid.moveEntity(this.position, this);
	}

	chooseNextDirectionAndGoal(edgeGrid: GridEdges): boolean {
		for (let i = 0; i < 4; ++i) {
			const _loc4_ =
				(this.facingDirection + EntityDroneMoveList[this.moveType][i]) % 4;
			if (
				this.chooseNextDirectionAndGoalTestDir(edgeGrid, _loc4_, this.nextGoal)
			) {
				this.facingDirection = _loc4_;
				return true;
			}
		}

		return false;
	}

	chooseNextDirectionAndGoalTestDir(
		edgeGrid: GridEdges,
		param2: number,
		nextGoal: Vector2
	): boolean {
		let _loc7_ = 0;
		let _loc8_ = 0;
		let _loc9_ = 0;
		let _loc10_ = 0;
		let _loc11_ = 0;
		let _loc12_ = 0;
		let _loc13_ = 0;
		let _loc14_ = 0;
		const _loc4_ = EntityDroneDirectionToVector[param2];
		const _loc5_ = this.position.x + _loc4_.x * this.stepSize;
		const _loc6_ = this.position.y + _loc4_.y * this.stepSize;
		if (_loc4_.y === 0) {
			_loc7_ = edgeGrid.getGridCoordinateFromWorldspace1D(
				this.position.x + _loc4_.x * this.radius
			);
			_loc8_ = edgeGrid.getGridCoordinateFromWorldspace1D(
				_loc5_ + _loc4_.x * this.radius
			);
			_loc9_ = edgeGrid.getGridCoordinateFromWorldspace1D(
				this.position.y - this.radius
			);
			_loc10_ = edgeGrid.getGridCoordinateFromWorldspace1D(
				this.position.y + this.radius
			);
			if (
				!edgeGrid.scanHorizontalDirected(
					_loc9_,
					_loc10_,
					_loc7_,
					_loc8_,
					_loc4_.x
				)
			) {
				return false;
			}
		} else {
			if (_loc4_.x !== 0) {
				throw new Error(
					`chooseNextDirectionAndGoalTestDir() has a non-axis-aligned search vector: ${_loc4_}`
				);
			}
			_loc11_ = edgeGrid.getGridCoordinateFromWorldspace1D(
				this.position.y + _loc4_.y * this.radius
			);
			_loc12_ = edgeGrid.getGridCoordinateFromWorldspace1D(
				_loc6_ + _loc4_.y * this.radius
			);
			_loc13_ = edgeGrid.getGridCoordinateFromWorldspace1D(
				this.position.x - this.radius
			);
			_loc14_ = edgeGrid.getGridCoordinateFromWorldspace1D(
				this.position.x + this.radius
			);
			if (
				!edgeGrid.scanVerticalDirected(
					_loc13_,
					_loc14_,
					_loc11_,
					_loc12_,
					_loc4_.y
				)
			) {
				return false;
			}
		}
		nextGoal.x = _loc5_;
		nextGoal.y = _loc6_;
		return true;
	}

	debugDraw(context: CanvasRenderingContext2D): void {
		// param1.SetStyle(0, 0, 100);
		// param1.DrawCircle(this.pos.x, this.pos.y, this.r);
		// const _loc2_: vec2 = new vec2(Math.cos(this.gfxorn), Math.sin(this.gfxorn));
		// param1.DrawLine(
		// 	this.pos.x,
		// 	this.pos.y,
		// 	this.pos.x + _loc2_.x * 8,
		// 	this.pos.y + _loc2_.y * 8
		// );
	}
}
