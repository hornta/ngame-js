import type { ByteArray } from "./byte-array";

import {
	EntityType,
	StructureSize,
	StructureToEntity,
	StructureType,
} from "./enum-data";

export enum EntityProp {
	ENTITY_PROP_TYPE = 0,
	ENTITY_PROP_X = 1,
	ENTITY_PROP_Y = 2,
	ENTITY_PROP_DIRECTION = 3,
	ENTITY_PROP_MOVE = 4,
}

export type EntityProps = [number, number, number, number, number];

export const NUM_COLS = 31;
export const NUM_ROWS = 23;

export class EditorState {
	tileIDs: number[];
	entities: EntityProps[];

	constructor() {
		this.tileIDs = [];
		this.entities = [];
	}

	static loadFromBytes(byteArray: ByteArray): EditorState {
		byteArray.readUnsignedByte();
		byteArray.readUnsignedByte();
		byteArray.readUnsignedByte();
		byteArray.readUnsignedByte();

		const editorState = new EditorState();

		const numTiles = NUM_COLS * NUM_ROWS;
		if (byteArray.bytesAvailable < numTiles) {
			throw new Error(
				"WARNING! Someone passed Load_From_Bytes() a bunch of bullshit; we didn't load it."
			);
		}

		for (let i = 0; i < numTiles; ++i) {
			editorState.tileIDs.push(byteArray.readUnsignedByte());
		}

		for (
			let structureId = 0;
			structureId < Object.keys(StructureType).length;
			++structureId
		) {
			if (byteArray.bytesAvailable < 2) {
				throw new Error(
					"WARNING! Someone passed Load_From_Bytes() a bunch of bullshit; we didn't load it."
				);
			}
			const num = byteArray.readShort();
			const prevPosition = byteArray.position;

			for (let k = 0; k < num; ++k) {
				const entity: EntityProps = [];
				editorState.entities.push(entity);
				entity.push(StructureToEntity[structureId]);
				const extraEntity: number[] = [];
				switch (structureId) {
					case StructureType.EXIT:
						editorState.entities.push(extraEntity);
						extraEntity.push(EntityType.EXIT_SWITCH);
						if (byteArray.bytesAvailable < 4) {
							throw new Error(
								"WARNING! Someone passed Load_From_Bytes() a bunch of bullshit; we didn't load it."
							);
						}
						entity.push(byteArray.readUnsignedByte());
						entity.push(byteArray.readUnsignedByte());
						extraEntity.push(byteArray.readUnsignedByte());
						extraEntity.push(byteArray.readUnsignedByte());
						break;
					case StructureType.DOOR_LOCKED:
						editorState.entities.push(extraEntity);
						extraEntity.push(EntityType.SWITCH_LOCKED);
						if (byteArray.bytesAvailable < 5) {
							throw new Error(
								"WARNING! Someone passed Load_From_Bytes() a bunch of bullshit; we didn't load it."
							);
						}
						entity.push(byteArray.readUnsignedByte());
						entity.push(byteArray.readUnsignedByte());
						entity.push(byteArray.readUnsignedByte());
						extraEntity.push(byteArray.readUnsignedByte());
						extraEntity.push(byteArray.readUnsignedByte());
						break;
					case StructureType.DOOR_TRAP:
						editorState.entities.push(extraEntity);
						extraEntity.push(EntityType.SWITCH_TRAP);
						if (byteArray.bytesAvailable < 5) {
							throw new Error(
								"WARNING! Someone passed Load_From_Bytes() a bunch of bullshit; we didn't load it."
							);
						}
						entity.push(byteArray.readUnsignedByte());
						entity.push(byteArray.readUnsignedByte());
						entity.push(byteArray.readUnsignedByte());
						extraEntity.push(byteArray.readUnsignedByte());
						extraEntity.push(byteArray.readUnsignedByte());
						break;
					default:
						if (byteArray.bytesAvailable < StructureSize[structureId]) {
							throw new Error(
								"WARNING! Someone passed Load_From_Bytes() a bunch of bullshit; we didn't load it."
							);
						}
						for (let l = 0; l < StructureSize[structureId]; ++l) {
							entity.push(byteArray.readUnsignedByte());
						}
				}
			}

			const a = byteArray.position - prevPosition;
			const b = num * StructureSize[structureId];
			if (a !== b) {
				throw new Error(
					`WARNING! Editor_State.Load_From_Bytes() read the wrong number of bytes: ${a} , ${b}`
				);
			}
		}

		return editorState;
	}
}
