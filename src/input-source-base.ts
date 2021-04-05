import type { ByteArray } from "./byte-array";

export enum InputBit {
	INPUT_JUMP = 1,
	INPUT_LEFT = 2,
	INPUT_RIGHT = 3,
}

export abstract class InputSourceBase {
	frames: ByteArray;
	currentJump: boolean;
	currentLeft: boolean;
	currentRight: boolean;

	constructor(frames: ByteArray) {
		this.frames = frames;
		this.currentJump = false;
		this.currentLeft = false;
		this.currentRight = false;
	}

	abstract tick(frame: number): void;

	isReplayFinished(): boolean {
		return false;
	}

	isButtonDownJumping(): boolean {
		return this.currentJump;
	}

	isButtonDownLeft(): boolean {
		return this.currentLeft;
	}

	iBbuttonDownRight(): boolean {
		return this.currentRight;
	}
}
