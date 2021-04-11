import type { ByteArray } from "../byte-array";
import {
	EditorState,
	EntityProp,
	EntityProps,
	NUM_COLS,
} from "../editor-state";
import {
	Direction,
	DirectionToVector,
	EntityType,
	QUANTIZE_STEP_SIZE,
} from "../enum-data";
import type { Input } from "src/input";
import { InputSourcePlayback } from "../input-source-playback";
import { InputSourceRecorder } from "../input-source-recorder";
import { NUM_TILE_TYPES, TileType } from "../tile-type";
import { BoundaryDefinition } from "./boundary-definitions";
import { BoundaryFlags } from "./boundary-flags";
import type { EntityBase } from "./entities/entity-base";
import { EntityBounceBlock } from "./entities/entity-bounce-block";
import { EntityDoorLocked } from "./entities/entity-door-locked";
import { EntityDoorRegular } from "./entities/entity-door-regular";
import { EntityDoorTrap } from "./entities/entity-door-trap";
import { EntityDroneChaingun } from "./entities/entity-drone-chaingun";
import { EntityDroneChaser } from "./entities/entity-drone-chaser";
import { EntityDroneLaser } from "./entities/entity-drone-laser";
import { EntityDroneZap } from "./entities/entity-drone-zap";
import { EntityExitDoor } from "./entities/entity-exit-door";
import { EntityExitSwitch } from "./entities/entity-exit-switch";
import { EntityFloorGuard } from "./entities/entity-floor-guard";
import { EntityGold } from "./entities/entity-gold";
import { EntityLaunchPad } from "./entities/entity-launch-pad";
import { EntityMine } from "./entities/entity-mine";
import { EntityOneWayPlatform } from "./entities/entity-one-way-platform";
import { EntityRocket } from "./entities/entity-rocket";
import { EntityThwomp } from "./entities/entity-thwomp";
import { EntityTurret } from "./entities/entity-turret";
import { GridEntity } from "./grid-entity";
import { GridSegment } from "./grid-segment";
import { Ninja } from "./ninja";
import type { Segment } from "./segment";
import { SegmentDefinition } from "./segment-definitions";
import { SegmentLinearDoubleSided } from "./segment-linear-double-sided";

import { Simulator } from "./simulator.js";
import { GridEdges } from "./grid-edges.js";
import { Vector2 } from "./vector2.js";

const newDirectionEnumToOldDirectionEnum = (oldDirection: number): number => {
	return Math.floor(oldDirection / 2);
};

const registerEntity = (entityList: EntityBase[], entity: EntityBase) => {
	entity.setId(entityList.length);
	entityList.push(entity);
};

const loadLevelEditorStateEntities = (
	entities: EntityProps[],
	gridSegment: GridSegment,
	gridEdges: GridEdges,
	gridEntity: GridEntity,
	entityList: EntityBase[],
	playerLocations: Vector2[]
) => {
	for (let i = 0; i < entities.length; ++i) {
		const entityProps = entities[i];
		const type = entityProps[EntityProp.ENTITY_PROP_TYPE];
		const x = entityProps[EntityProp.ENTITY_PROP_X] * QUANTIZE_STEP_SIZE;
		const y = entityProps[EntityProp.ENTITY_PROP_Y] * QUANTIZE_STEP_SIZE;
		let direction: Direction = null;
		let move;
		if (entityProps.length > 3) {
			direction = entityProps[EntityProp.ENTITY_PROP_DIRECTION];
			if (entityProps.length > 4) {
				move = entityProps[EntityProp.ENTITY_PROP_MOVE];
			}
		}

		if (type === EntityType.BOUNCEBLOCK) {
			registerEntity(entityList, new EntityBounceBlock(gridEntity, x, y));
		} else if (type === EntityType.CHAINGUN) {
			registerEntity(
				entityList,
				new EntityDroneChaingun(
					gridEntity,
					x,
					y,
					newDirectionEnumToOldDirectionEnum(direction),
					move
				)
			);
		} else if (type === EntityType.CHASER) {
			registerEntity(
				entityList,
				new EntityDroneChaser(
					gridEntity,
					x,
					y,
					newDirectionEnumToOldDirectionEnum(direction),
					move
				)
			);
		} else if (
			type === EntityType.DOOR_LOCKED ||
			type === EntityType.DOOR_REGULAR ||
			type === EntityType.DOOR_TRAP
		) {
			const directionVector = DirectionToVector[direction];
			_loc20_ = Math.floor((x - directionVector.x * 12) / 24);
			_loc21_ = Math.floor((y - directionVector.y * 12) / 24);
			const cellIndex = gridSegment.getCellIndexFromGridspacePosition(
				_loc20_,
				_loc21_
			);
			const isHorizontal = direction === 0;
			const edgeIndicies = [new Array<Vector2>(2)];
			if (!isHorizontal) {
				edgeIndicies.push(
					gridEdges.getCellIndexFromGridspacePosition(
						_loc20_ * 2,
						_loc21_ * 2 + 1
					)
				);
				edgeIndicies(
					gridEdges.getCellIndexFromGridspacePosition(
						_loc20_ * 2 + 1,
						_loc21_ * 2 + 1
					)
				);
			} else {
				edgeIndicies(
					gridEdges.getCellIndexFromGridspacePosition(
						_loc20_ * 2 + 1,
						_loc21_ * 2
					)
				);
				edgeIndicies.push(
					gridEdges.getCellIndexFromGridspacePosition(
						_loc20_ * 2 + 1,
						_loc21_ * 2 + 1
					)
				);
			}
			const _loc26_ = new Vector2(x, y);
			const _loc27_ = directionVector.perp();
			_loc27_.scale(12);
			const _loc28_ = _loc26_.plus(_loc27_);
			const _loc29_ = _loc26_.minus(_loc27_);
			_loc30_ = new SegmentLinearDoubleSided(
				_loc28_.x,
				_loc28_.y,
				_loc29_.x,
				_loc29_.y
			);
			if (type === EntityType.DOOR_REGULAR) {
				registerEntity(
					entityList,
					new EntityDoorRegular(
						gridEntity,
						gridSegment,
						cellIndex,
						_loc30_,
						gridEdges,
						edgeIndicies,
						isHorizontal,
						x,
						y
					)
				);
			} else {
				const x = entityProps[EntityProp.ENTITY_PROP_X] * QUANTIZE_STEP_SIZE;
				const y = entityProps[EntityProp.ENTITY_PROP_Y] * QUANTIZE_STEP_SIZE;
				if (type === EntityType.DOOR_LOCKED) {
					registerEntity(
						entityList,
						new EntityDoorLocked(
							gridEntity,
							gridSegment,
							cellIndex,
							_loc30_,
							gridEdges,
							edgeIndicies,
							isHorizontal,
							x,
							y
						)
					);
				} else if (type === EntityType.DOOR_TRAP) {
					registerEntity(
						entityList,
						new EntityDoorTrap(
							gridEntity,
							gridSegment,
							cellIndex,
							_loc30_,
							gridEdges,
							edgeIndicies,
							isHorizontal,
							_loc33_,
							_loc34_
						)
					);
				}
			}
		} else if (type === EntityType.EXIT_DOOR) {
			const exitDoor = new EntityExitDoor(x, y);
			registerEntity(entityList, exitDoor);
			const nextEntity = entities[i + 1];
			const xSwitch = nextEntity[EntityProp.ENTITY_PROP_X] * QUANTIZE_STEP_SIZE;
			const ySwitch = nextEntity[EntityProp.ENTITY_PROP_Y] * QUANTIZE_STEP_SIZE;

			registerEntity(
				entityList,
				new EntityExitSwitch(gridEntity, xSwitch, ySwitch, exitDoor)
			);
		} else if (type === EntityType.EXIT_SWITCH) {
			if (i > 0) {
				if (
					entities[i - 1][EntityProp.ENTITY_PROP_TYPE] === EntityType.EXIT_DOOR
				) {
					continue;
				}
			}
			throw new Error(
				`loadLevelEditorStateEntities() found an exit switch without preceeding exit door!: ${i}`
			);
		} else if (type === EntityType.FLOORGUARD) {
			registerEntity(entityList, new EntityFloorGuard(gridEntity, x, y));
		} else if (type === EntityType.GOLD) {
			registerEntity(entityList, new EntityGold(gridEntity, x, y));
		} else if (type === EntityType.LASER) {
			registerEntity(
				entityList,
				new EntityDroneLaser(
					gridEntity,
					x,
					y,
					newDirectionEnumToOldDirectionEnum(direction),
					move
				)
			);
		} else if (type === EntityType.LAUNCHPAD) {
			const directionVector = DirectionToVector[direction];
			registerEntity(
				entityList,
				new EntityLaunchPad(
					gridEntity,
					x,
					y,
					directionVector.x,
					directionVector.y
				)
			);
		} else if (type === EntityType.MINE) {
			registerEntity(entityList, new EntityMine(gridEntity, x, y));
		} else if (type === EntityType.ONEWAY) {
			const directionVector = DirectionToVector[direction];
			registerEntity(
				entityList,
				new EntityOneWayPlatform(
					gridEntity,
					x,
					y,
					directionVector.x,
					directionVector.y
				)
			);
		} else if (type === EntityType.PLAYER) {
			playerLocations.push(new Vector2(x, y));
		} else if (type === EntityType.ROCKET) {
			registerEntity(entityList, new EntityRocket(gridEntity, x, y));
		} else if (type === EntityType.SWITCH_LOCKED) {
			if (i > 0) {
				if (
					entities[i - 1][EntityProp.ENTITY_PROP_TYPE] ===
					EntityType.DOOR_LOCKED
				) {
					continue;
				}
			}
			throw new Error(
				`loadLevelEditorStateEntities() found a locked switch without preceeding locked door!: ${i}`
			);
		} else if (type === EntityType.SWITCH_TRAP) {
			if (i > 0) {
				if (
					entities[i - 1][EntityProp.ENTITY_PROP_TYPE] === EntityType.DOOR_TRAP
				) {
					continue;
				}
			}
			throw new Error(
				`loadLevelEditorStateEntities() found a locked switch without preceeding trap door!: ${i}`
			);
		} else if (type === EntityType.THWOMP) {
			const directionVector = DirectionToVector[direction];
			_loc52_ = 0;
			_loc53_ = false;
			if (directionVector.y === 0) {
				_loc52_ = directionVector.x;
				_loc53_ = true;
			} else {
				_loc52_ = directionVector.y;
			}
			registerEntity(
				entityList,
				new EntityThwomp(gridEntity, x, y, _loc52_, _loc53_)
			);
		} else if (type === EntityType.TURRET) {
			registerEntity(entityList, new EntityTurret(x, y));
		} else if (type === EntityType.ZAP) {
			registerEntity(
				entityList,
				new EntityDroneZap(
					gridEntity,
					x,
					y,
					newDirectionEnumToOldDirectionEnum(direction),
					move as number
				)
			);
		}
	}
};

const initTileIDGridWithBoundaryEdges = (
	tileIds: TileType[],
	numCols: number,
	numRows: number
): void => {
	const _loc4_ = numCols * numRows;
	let _loc5_ = 0;
	while (_loc5_ < _loc4_) {
		tileIds[_loc5_] = TileType.EMPTY;
		_loc5_++;
	}
	let _loc6_ = 1;
	while (_loc6_ < numCols - 1) {
		tileIds[_loc6_] = TileType.EDGE_BOTTOM;
		tileIds[_loc6_ + (numRows - 1) * numCols] = TileType.EDGE_TOP;
		_loc6_++;
	}
	let _loc7_ = 1;
	while (_loc7_ < numRows - 1) {
		tileIds[_loc7_ * numCols] = TileType.EDGE_RIGHT;
		tileIds[numCols - 1 + _loc7_ * numCols] = TileType.EDGE_LEFT;
		_loc7_++;
	}
	tileIds[0] = TileType.EDGE_CORNER_UL;
	tileIds[numCols - 1] = TileType.EDGE_CORNER_UR;
	tileIds[(numRows - 1) * numCols] = TileType.EDGE_CORNER_DL;
	tileIds[numRows * numCols - 1] = TileType.EDGE_CORNER_DR;
};

const generateTileSegmentsFiltered = (
	tileType: TileType,
	param2: number[],
	param3: number,
	param4: number,
	param5: number
): Segment[] => {
	let _loc9_ = false;
	let _loc10_ = false;

	if (tileType < 0 || tileType >= NUM_TILE_TYPES) {
		throw new Error(
			`generateTileSegmentsFiltered() was passed an invalid tiletype: ${tileType}`
		);
	}
	const segments: Segment[] = [];
	let _loc7_ = 0;
	while (_loc7_ < 4) {
		_loc9_ =
			BoundaryFlags[tileType][_loc7_ * 2] &&
			!BoundaryFlags[param2[_loc7_]][(_loc7_ * 2 + 4) % 8];
		_loc10_ =
			BoundaryFlags[tileType][_loc7_ * 2 + 1] &&
			!BoundaryFlags[param2[_loc7_]][(_loc7_ * 2 + 1 + 4) % 8];
		if (_loc9_) {
			if (_loc10_) {
				segments.push(
					BoundaryDefinition[_loc7_ * 3 + 2].generateCollisionSegment(
						param3,
						param4,
						param5
					)
				);
			} else {
				segments.push(
					BoundaryDefinition[_loc7_ * 3].generateCollisionSegment(
						param3,
						param4,
						param5
					)
				);
			}
		} else if (_loc10_) {
			segments.push(
				BoundaryDefinition[_loc7_ * 3 + 1].generateCollisionSegment(
					param3,
					param4,
					param5
				)
			);
		}
		_loc7_++;
	}
	const tileEdge = SegmentDefinition[tileType];
	if (tileEdge !== null) {
		segments.push(tileEdge.generateCollisionSegment(param3, param4, param5));
	}
	return segments;
};

const buildTileSegs = (
	segmentGrid: GridSegment,
	cellSize: number,
	halfCellSize: number,
	param4: number,
	param5: number,
	tileType: TileType,
	param7: number[]
): void => {
	const segments = generateTileSegmentsFiltered(
		tileType,
		param7,
		param4 * cellSize + halfCellSize,
		param5 * cellSize + halfCellSize,
		halfCellSize
	);
	for (const segment of segments) {
		segmentGrid.addSegToCell(param4, param5, segment);
	}
};

const loadLevelEditorStateTiles = (
	editorTileIds: number[],
	tileIds: TileType[],
	segmentGrid: GridSegment,
	edgeGrid: GridEdges,
	numCols: number,
	numRows: number,
	cellSize: number,
	halfCellSize: number
): void => {
	segmentGrid.clear();
	edgeGrid.clear();
	initTileIDGridWithBoundaryEdges(tileIds, numCols, numRows);

	for (let i = 0; i < editorTileIds.length; ++i) {
		const x = 1 + (i % NUM_COLS);
		const y = 1 + Math.floor(i / NUM_COLS);
		tileIds[x + y * numCols] = editorTileIds[i];
	}

	const _loc10_ = new Array<number>(4);
	for (let i = 0; i < tileIds.length; ++i) {
		const x = i % numCols;
		const y = Math.floor(i / numCols);
		if (x === 0) {
			_loc10_[0] = TileType.EMPTY;
		} else {
			_loc10_[0] = tileIds[x - 1 + y * numCols];
		}
		if (x === numCols - 1) {
			_loc10_[2] = TileType.EMPTY;
		} else {
			_loc10_[2] = tileIds[x + 1 + y * numCols];
		}
		if (y === 0) {
			_loc10_[3] = TileType.EMPTY;
		} else {
			_loc10_[3] = tileIds[x + (y - 1) * numCols];
		}
		if (y === numRows - 1) {
			_loc10_[1] = TileType.EMPTY;
		} else {
			_loc10_[1] = tileIds[x + (y + 1) * numCols];
		}
		buildTileSegs(
			segmentGrid,
			cellSize,
			halfCellSize,
			x,
			y,
			tileIds[i],
			_loc10_
		);
		edgeGrid.loadTileEdges(x, y, tileIds[i]);
	}
};

export const loadLevelFromEditorState = (
	playerActions: string[],
	playerColors: number[],
	input: Input,
	inputData: ByteArray,
	numberOfPlayers: number,
	editorState: EditorState
): Simulator => {
	const tileIds = new Array(
		Simulator.GRID_NUM_COLUMNS * Simulator.GRID_NUM_ROWS
	);
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
	loadLevelEditorStateTiles(
		editorState.tileIDs,
		tileIds,
		gridSegment,
		gridEdges,
		Simulator.GRID_NUM_COLUMNS,
		Simulator.GRID_NUM_ROWS,
		Simulator.GRID_CELL_SIZE,
		Simulator.GRID_CELL_HALFWIDTH
	);

	loadLevelEditorStateEntities(
		editorState.entities,
		gridSegment,
		gridEdges,
		gridEntity,
		entities,
		playerLocations
	);
	if (playerLocations.length === 0) {
		throw new Error("No player was loaded.");
	}

	while (playerLocations.length < numberOfPlayers) {
		console.log("Creating one more ninja.");
		playerLocations.push(playerLocations[0].clone());
	}

	while (playerLocations.length > numberOfPlayers) {
		playerLocations.pop();
	}
	if (playerLocations.length === 2) {
		playerLocations[0].x -= 4;
		playerLocations[1].x += 4;
	}

	const players = [] as Ninja[];
	playerLocations.forEach((location, index) => {
		let inputSource;
		if (inputData === null) {
			inputSource = new InputSourceRecorder(
				input,
				playerActions[(index * 3) % playerActions.length],
				playerActions[(index * 3 + 1) % playerActions.length],
				playerActions[(index * 3 + 2) % playerActions.length]
			);
		} else {
			inputSource = new InputSourcePlayback(inputData);
		}

		players.push(
			new Ninja(index, inputSource, location.x, location.y, playerColors[index])
		);
	});

	return new Simulator(
		tileIds,
		gridSegment,
		gridEdges,
		gridEntity,
		entities,
		players
	);
};
