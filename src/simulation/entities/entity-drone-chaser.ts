import type { GridEdges } from "../grid-edges";
import type { GridEntity } from "../grid-entity";
import type { Ninja } from "../ninja";
import { EntityDroneZap } from "./entity-drone-zap";
import {
	EntityDroneDirectionToVector,
	EntityDroneMoveList,
} from "./entity-drone-utils";

export class EntityDroneChaser extends EntityDroneZap {
	isChasing: boolean;
	speedRegular: number;
	speedChasing: number;
	oldChaseDirection: number;

	constructor(
		entityGrid: GridEntity,
		x: number,
		y: number,
		facingDirection: number,
		moveType: number
	) {
		super(entityGrid, x, y, facingDirection, moveType);
		this.isChasing = false;
		this.speedRegular = this.speed;
		this.speedChasing = this.speed * 2;
		this.oldChaseDirection = -1;
	}

	startChasing(facingDirection: number): void {
		this.facingDirection = facingDirection;
		this.speed = this.speedChasing;
		this.isChasing = true;
		// this.gfx_startedChasing = true;
	}

	stopChasing(facingDirection: number): void {
		this.oldChaseDirection = this.facingDirection;
		this.facingDirection = facingDirection;
		this.speed = this.speedRegular;
		this.isChasing = false;
	}

	chooseNextDirAndGoal(edgeGrid: GridEdges, players: Ninja[]): boolean {
		let _loc12_ = false;
		let _loc13_: int = 0;
		let _loc14_: int = 0;
		let _loc15_: int = 0;
		let _loc16_: int = 0;
		let _loc17_: int = 0;
		let _loc18_: int = 0;
		let _loc19_: int = 0;
		let _loc20_: int = 0;
		let _loc21_: int = 0;
		if (this.isChasing) {
			if (
				this.chooseNextDirectionAndGoalTestDir(
					edgeGrid,
					this.facingDirection,
					this.nextGoal
				)
			) {
				return true;
			}
			const newDirection =
				(this.facingDirection - EntityDroneMoveList[this.moveType][0] + 4) % 4;
			this.stopChasing(newDirection);
		}
		let _loc3_ = this.facingDirection;
		if (this.oldChaseDirection !== -1) {
			_loc3_ = this.oldChaseDirection;
			this.oldChaseDirection = -1;
		}

		for (const player of players) {
			if (!player.isDead()) {
				const playerPosition_ = player.getPosition();
				for (let _loc7_ = -1; _loc7_ <= 1; _loc7_++) {
					const _loc8_ = (_loc3_ + _loc7_ + 4) % 4;
					const _loc9_ = EntityDroneDirectionToVector[_loc8_];
					const _loc10_ = playerPosition_.x - this.position.x;
					const _loc11_ = playerPosition_.y - this.position.y;
					if (_loc9_.x * _loc10_ + _loc9_.y * _loc11_ > 0) {
						if (Math.abs(-_loc9_.y * _loc10_ + _loc9_.x * _loc11_) <= 12) {
							_loc12_ = true;
							_loc13_ = 1;
							if (_loc8_ % 2 === 1) {
								_loc12_ = false;
							}
							if (_loc8_ >= 2) {
								_loc13_ = -1;
							}
							if (_loc12_) {
								_loc14_ = edgeGrid.getGridCoordinateFromWorldspace1D(
									this.position.x
								);
								_loc15_ = edgeGrid.getGridCoordinateFromWorldspace1D(
									this.position.y
								);
								_loc16_ = edgeGrid.sweepHorizontal(
									_loc15_,
									_loc15_,
									_loc14_,
									_loc13_
								);
								if (
									(_loc17_ = edgeGrid.getGridCoordinateFromWorldspace1D(
										playerPosition_.x
									)) < Math.min(_loc14_, _loc16_) ||
									_loc17_ > Math.max(_loc14_, _loc16_)
								) {
									continue;
								}
							} else {
								_loc18_ = edgeGrid.getGridCoordinateFromWorldspace1D(
									this.position.y
								);
								_loc19_ = edgeGrid.getGridCoordinateFromWorldspace1D(
									this.position.x
								);
								_loc20_ = edgeGrid.sweepVertical(
									_loc19_,
									_loc19_,
									_loc18_,
									_loc13_
								);
								if (
									(_loc21_ = edgeGrid.getGridCoordinateFromWorldspace1D(
										playerPosition_.y
									)) < Math.min(_loc18_, _loc20_) ||
									_loc21_ > Math.max(_loc18_, _loc20_)
								) {
									continue;
								}
							}
							if (
								this.chooseNextDirectionAndGoalTestDir(
									edgeGrid,
									_loc8_,
									next_goal
								)
							) {
								this.startChasing(_loc8_);
								return true;
							}
						}
					}
				}
			}
		}

		return this.chooseNextDirectionAndGoal(edgeGrid, players);
	}

	// override public function GenerateGraphicComponent() : EntityGraphics
	// {
	// 	 return new EntityGraphics_Drone_Chaser(this);
	// }

	// override public function GFX_UpdateState(param1:EntityGraphics) : void
	// {
	// 	 var _loc2_:EntityGraphics_Drone_Chaser = param1 as EntityGraphics_Drone_Chaser;
	// 	 _loc2_.pos.x = pos.x;
	// 	 _loc2_.pos.y = pos.y;
	// 	 _loc2_.orn = gfxorn;
	// 	 if(this.gfx_startedChasing)
	// 	 {
	// 			this.gfx_startedChasing = false;
	// 			_loc2_.anim = EntityGraphics_Drone_Chaser.ANIM_CHASE;
	// 	 }
	// 	 else
	// 	 {
	// 			_loc2_.anim = EntityGraphics_Drone_Chaser.ANIM_IDLE;
	// 	 }
	// }

	// override public function Debug_Draw(param1:SimpleRenderer) : void
	// {
	// 	 super.Debug_Draw(param1);
	// 	 var _loc2_:Number = pos.x + Math.SQRT1_2 * r;
	// 	 var _loc3_:Number = pos.y - Math.SQRT1_2 * r;
	// 	 if(this.isChasing)
	// 	 {
	// 			param1.SetStyle(2,0,100);
	// 	 }
	// 	 else
	// 	 {
	// 			param1.SetStyle(0,0,100);
	// 	 }
	// 	 param1.DrawLine(_loc2_,_loc3_,_loc2_,_loc3_ - 8);
	// }
}
