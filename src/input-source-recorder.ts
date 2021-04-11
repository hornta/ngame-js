import { Buffer } from "buffer";
import type { Input } from "./input";
import { InputBit, InputSourceBase } from "./input-source-base";

export class InputSourceRecorder extends InputSourceBase {
	input: Input;
	keyJump: string;
	keyLeft: string;
	keyRight: string;

	constructor(
		input: Input,
		keyJump: string,
		keyLeft: string,
		keyRight: string
	) {
		super(Buffer.alloc(4096));
		this.input = input;
		this.keyJump = keyJump;
		this.keyLeft = keyLeft;
		this.keyRight = keyRight;
	}

	tick(frame: number): void {
		this.currentJump = this.input.isKeyDown(this.keyJump);
		this.currentLeft = this.input.isKeyDown(this.keyLeft);
		this.currentRight = this.input.isKeyDown(this.keyRight);
		if (frame >= this.frames.length) {
			this.frames.length = frame * 2;
		}
		let frameInput = 0;
		if (this.currentJump) {
			frameInput |= InputBit.JUMP;
		}
		if (this.currentLeft) {
			frameInput |= InputBit.LEFT;
		}
		if (this.currentRight) {
			frameInput |= InputBit.RIGHT;
		}
		this.frames.position = frame;
		this.frames.writeByte(frameInput);
	}
}
