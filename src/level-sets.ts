import { Buffer } from "buffer";
import { ByteArray } from "./byte-array.js";
import { metanetLevels } from "./metanet-levels.js";

const NUMBER_OF_EPISODES = 120;
const LEVELS_PER_SET = 5;

const downloaded: ByteArray[][] = [];
for (let i = 0; i < NUMBER_OF_EPISODES; ++i) {
	downloaded.push(new Array<ByteArray>(LEVELS_PER_SET));
}

const bytes = new ByteArray(metanetLevels);
while (bytes.position < bytes.length) {
	const _loc2_ = bytes.readInt();
	const _loc3_ = bytes.readInt();
	const _loc4_ = bytes.readInt();
	const levelBytes = new ByteArray(Buffer.alloc(4096));
	bytes.readBytes(levelBytes, 0, _loc4_);
	levelBytes.position = 0;

	downloaded[_loc2_][_loc3_] = levelBytes;
}

export const getLevelByID = (id: number): ByteArray => {
	const levelIndex = id - 1;
	const _loc3_ = levelIndex / 5;
	const _loc4_ = levelIndex % 5;
	return downloaded[_loc3_][_loc4_];
};
