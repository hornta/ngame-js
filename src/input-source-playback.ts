import type { ByteArray } from "./byte-array.js";
import { InputBit, InputSourceBase } from "./input-source-base";

export class InputSourcePlayback extends InputSourceBase {
	isFinished: boolean;

	constructor(input: ByteArray) {
		super(input);
		this.isFinished = false;
	}

	isReplayFinished(): boolean {
		return this.isFinished;
	}

	tick(frame: number): void {
		if (frame >= this.frames.length) {
			this.currentJump = false;
			this.currentLeft = false;
			this.currentRight = false;
			this.isFinished = true;
		} else {
			this.frames.position = frame;
			const frameInput = this.frames.readByte();
			this.currentJump = (frameInput & InputBit.JUMP) > 0;
			this.currentLeft = (frameInput & InputBit.LEFT) > 0;
			this.currentRight = (frameInput & InputBit.RIGHT) > 0;
		}
	}
}
