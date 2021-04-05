import { EditorState, EntityProp, EntityProps } from "src/editor-state";
import { EntityType, QUANTIZE_STEP_SIZE } from "src/enum-data";
import type { EntityBase } from "./entities/entity-base";
import type { GridEdges } from "./grid-edges";
import { GridEntity } from "./grid-entity";
import { GridSegment } from "./grid-segment";
import type { Simulator } from "./simulator";
import type { Vector2 } from "./vector2";

const registerEntity = (entityList: EntityBase[], entity: EntityBase) => {
	entity.setId(entityList.length);
	entityList.push(entity);
};

const LoadLevelEditorStateEntities = (
	entities: EntityProps[],
	gridSegment: GridSegment,
	gridEdges: GridEdges,
	gridEntity: GridEntity,
	entityList: EntityBase[],
	playerLocations: Vector2[]
) => {
	for (const entityProps of entities) {
		const type = entityProps[EntityProp.ENTITY_PROP_TYPE];
		const x = entityProps[EntityProp.ENTITY_PROP_X] * QUANTIZE_STEP_SIZE;
		const y = entityProps[EntityProp.ENTITY_PROP_Y] * QUANTIZE_STEP_SIZE;
		let direction;
		let move;
		if (entityProps.length > 3) {
			direction = entityProps[EntityProp.ENTITY_PROP_DIRECTION];
			if (entityProps.length > 4) {
				move = entityProps[EntityProp.ENTITY_PROP_MOVE];
			}
		}

		if (type == EntityType.BOUNCEBLOCK) {
			registerEntity(
				entityList,
				new Entity_BounceBlock(param4, _loc12_, _loc13_)
			);
		} else if (type == EntityType.CHAINGUN) {
			_loc17_ = new Entity_Drone_Chaingun(
				param4,
				_loc12_,
				_loc13_,
				Helper_Editor_NewDirEnumToOldDirEnum(_loc14_),
				_loc15_
			);
			registerEntity(entityList, _loc17_);
		} else if (type == EntityType.CHASER) {
			_loc18_ = new Entity_Drone_Chaser(
				param4,
				_loc12_,
				_loc13_,
				Helper_Editor_NewDirEnumToOldDirEnum(_loc14_),
				_loc15_
			);
			registerEntity(entityList, _loc18_);
		} else if (
			type == EntityType.DOOR_LOCKED ||
			type == EntityType.DOOR_REGULAR ||
			type == EntityType.DOOR_TRAP
		) {
			_loc19_ = edat.MAP_DIR_TO_VEC(_loc14_);
			_loc20_ = Math.floor((_loc12_ - _loc19_.x * 12) / 24);
			_loc21_ = Math.floor((_loc13_ - _loc19_.y * 12) / 24);
			_loc22_ = param2.DOOR_GetCellIndexFromGridspacePosition(_loc20_, _loc21_);
			_loc23_ = _loc14_ == 0;
			_loc24_ = new Array<Vector2>(2);
			if (!_loc23_) {
				_loc24_[0] = param3.DOOR_GetCellIndexFromGridspacePosition(
					_loc20_ * 2,
					_loc21_ * 2 + 1
				);
				_loc24_[1] = param3.DOOR_GetCellIndexFromGridspacePosition(
					_loc20_ * 2 + 1,
					_loc21_ * 2 + 1
				);
			} else {
				_loc24_[0] = param3.DOOR_GetCellIndexFromGridspacePosition(
					_loc20_ * 2 + 1,
					_loc21_ * 2
				);
				_loc24_[1] = param3.DOOR_GetCellIndexFromGridspacePosition(
					_loc20_ * 2 + 1,
					_loc21_ * 2 + 1
				);
			}
			_loc25_ = param2.DEBUG_GetWorldspaceCellCenterPositionFromIndex(_loc22_);
			_loc26_ = new vec2(_loc12_, _loc13_);
			(_loc27_ = _loc19_.Perp()).Scale(12);
			_loc28_ = _loc26_.Plus(_loc27_);
			_loc29_ = _loc26_.Minus(_loc27_);
			_loc30_ = new Segment_Linear_DoubleSided(
				_loc28_.x,
				_loc28_.y,
				_loc29_.x,
				_loc29_.y
			);
			if (type == EntityType.DOOR_REGULAR) {
				_loc31_ = new Entity_Door_Regular(
					param4,
					param2,
					_loc22_,
					_loc30_,
					param3,
					_loc24_,
					_loc23_,
					_loc12_,
					_loc13_
				);
				registerEntity(entityList, _loc31_);
			} else {
				_loc33_ =
					(_loc32_ = param1[_loc9_ + 1])[edat.EPROP_X] *
					edat.quantize_step_size;
				_loc34_ = _loc32_[edat.EPROP_Y] * edat.quantize_step_size;
				if (type == edat.ETYPE_DOOR_LOCKED) {
					_loc35_ = new Entity_Door_Locked(
						param4,
						param2,
						_loc22_,
						_loc30_,
						param3,
						_loc24_,
						_loc23_,
						_loc33_,
						_loc34_
					);
					registerEntity(entityList, _loc35_);
				} else if (type == edat.ETYPE_DOOR_TRAP) {
					_loc36_ = new Entity_Door_Trap(
						param4,
						param2,
						_loc22_,
						_loc30_,
						param3,
						_loc24_,
						_loc23_,
						_loc33_,
						_loc34_
					);
					registerEntity(entityList, _loc36_);
				}
			}
		} else if (type == EntityType.EXIT_DOOR) {
			_loc37_ = new Entity_ExitDoor(_loc12_, _loc13_);
			registerEntity(entityList, _loc37_);
			_loc39_ =
				(_loc38_ = param1[_loc9_ + 1])[edat.EPROP_X] * edat.quantize_step_size;
			_loc40_ = _loc38_[edat.EPROP_Y] * edat.quantize_step_size;
			_loc41_ = new Entity_ExitSwitch(param4, _loc39_, _loc40_, _loc37_);
			registerEntity(entityList, _loc41_);
		} else if (type == EntityType.EXIT_SWITCH) {
			if (_loc9_ > 0) {
				if (param1[_loc9_ - 1][edat.EPROP_TYPE] == EntityType.EXIT_DOOR) {
					continue;
				}
			}
			trace(
				`WARNING! LoadLevel_EditorState_Entities() found an exit switch without preceeding exit door!: ${_loc9_}`
			);
		} else if (type == EntityType.FLOORGUARD) {
			_loc42_ = new Entity_FloorGuard(param4, _loc12_, _loc13_);
			registerEntity(entityList, _loc42_);
		} else if (type == EntityType.GOLD) {
			_loc43_ = new Entity_Gold(param4, _loc12_, _loc13_);
			registerEntity(entityList, _loc43_);
		} else if (type == EntityType.LASER) {
			_loc44_ = new Entity_Drone_Laser(
				param4,
				_loc12_,
				_loc13_,
				Helper_Editor_NewDirEnumToOldDirEnum(_loc14_),
				_loc15_
			);
			registerEntity(entityList, _loc44_);
		} else if (type == EntityType.LAUNCHPAD) {
			_loc45_ = edat.MAP_DIR_TO_VEC(_loc14_);
			_loc46_ = new Entity_Launchpad(
				param4,
				_loc12_,
				_loc13_,
				_loc45_.x,
				_loc45_.y
			);
			registerEntity(entityList, _loc46_);
		} else if (type == EntityType.MINE) {
			_loc47_ = new Entity_Mine(param4, _loc12_, _loc13_);
			registerEntity(entityList, _loc47_);
		} else if (type == EntityType.ONEWAY) {
			_loc48_ = edat.MAP_DIR_TO_VEC(_loc14_);
			_loc49_ = new Entity_OnewayPlatform(
				param4,
				_loc12_,
				_loc13_,
				_loc48_.x,
				_loc48_.y
			);
			registerEntity(entityList, _loc49_);
		} else if (type == EntityType.PLAYER) {
			param6.push(new vec2(_loc12_, _loc13_));
		} else if (type == EntityType.ROCKET) {
			_loc50_ = new Entity_Rocket(param4, _loc12_, _loc13_);
			registerEntity(entityList, _loc50_);
		} else if (type == EntityType.SWITCH_LOCKED) {
			if (_loc9_ > 0) {
				if (param1[_loc9_ - 1][edat.EPROP_TYPE] == EntityType.DOOR_LOCKED) {
					continue;
				}
			}
			trace(
				`WARNING! LoadLevel_EditorState_Entities() found a locked switch without preceeding locked door!: ${_loc9_}`
			);
		} else if (type == EntityType.SWITCH_TRAP) {
			if (_loc9_ > 0) {
				if (param1[_loc9_ - 1][edat.EPROP_TYPE] == EntityType.DOOR_TRAP) {
					continue;
				}
			}
			trace(
				`WARNING! LoadLevel_EditorState_Entities() found a locked switch without preceeding trap door!: ${_loc9_}`
			);
		} else if (type == EntityType.THWOMP) {
			_loc51_ = edat.MAP_DIR_TO_VEC(_loc14_);
			_loc52_ = 0;
			_loc53_ = false;
			if (_loc51_.y == 0) {
				_loc52_ = _loc51_.x;
				_loc53_ = true;
			} else {
				_loc52_ = _loc51_.y;
			}
			_loc54_ = new Entity_Thwomp(param4, _loc12_, _loc13_, _loc52_, _loc53_);
			registerEntity(entityList, _loc54_);
		} else if (type == EntityType.TURRET) {
			_loc55_ = new Entity_Turret(param4, _loc12_, _loc13_);
			registerEntity(entityList, _loc55_);
		} else if (type == EntityType.ZAP) {
			_loc56_ = new Entity_Drone_Zap(
				param4,
				_loc12_,
				_loc13_,
				Helper_Editor_NewDirEnumToOldDirEnum(_loc14_),
				_loc15_
			);
			registerEntity(entityList, _loc56_);
		}
	}
};

export const LoadLevelFromEditorState = (
	playerActions: number[],
	editorState: EditorState
): Simulator => {
	const gridSegment = new GridSegment(
		Simulator.GRID_NUM_COLUMNS,
		Simulator.GRID_NUM_ROWS,
		Simulator.GRID_CELL_SIZE
	);
	const gridEdges = new GridEdges(
		Simulator.GRID_NUM_COLUMNS * 2,
		Simulator.GRID_NUM_ROWS * 2,
		Simulator.GRID_CELL_SIZE * 0.5
	);
	const gridEntity = new GridEntity(
		Simulator.GRID_NUM_COLUMNS,
		Simulator.GRID_NUM_ROWS,
		Simulator.GRID_CELL_SIZE
	);
	const entities: EntityBase[] = [];
	const playerLocations: Vector2[] = [];
	LoadLevelEditorStateEntities(
		editorState.entities,
		gridSegment,
		gridEdges,
		gridEntity,
		entities,
		playerLocations
	);
	return new Simulator();
};
