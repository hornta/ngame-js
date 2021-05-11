import { Buffer } from "buffer";

const Values = {
	MAX_BUFFER_SIZE: 4096,

	BIG_ENDIAN: true,
	LITTLE_ENDIAN: false,

	DEFLATE: "deflate",
	LZMA: "lzma",
	ZLIB: "zlib",
};

export class ByteArray {
	offset: number;
	endian: boolean;
	buffer: Buffer;

	constructor(buff: Buffer) {
		this.offset = 0;
		this.endian = Values.BIG_ENDIAN;
		this.buffer = buff;
	}

	newFromAvailable(): ByteArray {
		const byteArray = new ByteArray(Buffer.alloc(this.bytesAvailable));
		this.readBytes(byteArray, 0);
		byteArray.reset();
		return byteArray;
	}

	get position(): number {
		return this.offset;
	}

	set position(value: number) {
		this.offset = value;
	}

	get length(): number {
		return this.buffer.length;
	}

	get bytesAvailable(): number {
		return this.length - this.offset;
	}

	reset(): void {
		this.offset = 0;
	}

	range(length: number): number[] {
		return Array.from({ length: length }, (x, i) => i);
	}

	updatePosition(n: number): number {
		if (n > Values.MAX_BUFFER_SIZE) {
			throw new RangeError(
				`ByteArray::updatePosition - Error: Trying to access beyond buffer length with position: ${n}`
			);
		}
		const a = this.offset;
		this.offset += n;
		return a;
	}

	readBoolean(): boolean {
		return Boolean(this.buffer.readInt8(this.updatePosition(1)));
	}

	readByte(): number {
		return this.buffer.readInt8(this.updatePosition(1));
	}

	readBytes(
		bytes: ByteArray,
		offset = this.offset,
		length = this.bytesAvailable
	): void {
		for (let i = offset; i < length; i++) {
			bytes.writeByte(this.readByte());
		}
	}

	readDouble(): number {
		return this.endian === Values.BIG_ENDIAN
			? this.buffer.readDoubleBE(this.updatePosition(8))
			: this.buffer.readDoubleLE(this.updatePosition(8));
	}

	readFloat(): number {
		return this.endian === Values.BIG_ENDIAN
			? this.buffer.readFloatBE(this.updatePosition(4))
			: this.buffer.readFloatLE(this.updatePosition(4));
	}

	readInt(): number {
		return this.endian === Values.BIG_ENDIAN
			? this.buffer.readInt32BE(this.updatePosition(4))
			: this.buffer.readInt32LE(this.updatePosition(4));
	}

	readMultiByte(length: number, charset: BufferEncoding): string {
		const offset = this.updatePosition(length);
		return this.buffer.toString(charset || "utf8", offset, offset + length);
	}

	readShort(): number {
		return this.endian === Values.BIG_ENDIAN
			? this.buffer.readInt16BE(this.updatePosition(2))
			: this.buffer.readInt16LE(this.updatePosition(2));
	}

	readUnsignedByte(): number {
		return this.buffer.readUInt8(this.updatePosition(1));
	}

	readUnsignedInt(): number {
		return this.endian === Values.BIG_ENDIAN
			? this.buffer.readUInt32BE(this.updatePosition(4))
			: this.buffer.readUInt32LE(this.updatePosition(4));
	}

	readUnsignedShort(): number {
		return this.endian === Values.BIG_ENDIAN
			? this.buffer.readUInt16BE(this.updatePosition(2))
			: this.buffer.readUInt16LE(this.updatePosition(2));
	}

	readUTF(): string {
		const length = this.readShort();
		const string = this.buffer.toString(
			"utf8",
			this.offset,
			this.offset + length
		);
		this.updatePosition(length);
		return string;
	}

	readUTFBytes(length: number): string {
		const offset = this.updatePosition(length);
		return this.buffer.toString("utf8", offset, offset + length);
	}

	toString(): string {
		return this.buffer.toString("utf8", this.offset, this.length);
	}

	readChar(): string {
		return String.fromCharCode(this.buffer[this.offset++]);
	}

	readByteArray(length: number): Int8Array {
		return new Int8Array(this.range(length).map(() => this.readByte()));
	}

	readShortArray(length: number): Int16Array {
		return new Int16Array(this.range(length).map(() => this.readShort()));
	}

	readIntArray(length: number): Int32Array {
		return new Int32Array(this.range(length).map(() => this.readInt()));
	}

	readLong(): number {
		return this.endian === Values.BIG_ENDIAN
			? this.buffer.readInt32BE(this.updatePosition(4)) |
					this.buffer.readInt32BE(this.updatePosition(4))
			: this.buffer.readInt32LE(this.updatePosition(4)) |
					this.buffer.readInt32LE(this.updatePosition(4));
	}

	readUnsignedLong(): number {
		return this.endian === Values.BIG_ENDIAN
			? this.buffer.readUInt32BE(this.updatePosition(4)) |
					this.buffer.readUInt32BE(this.updatePosition(4))
			: this.buffer.readUInt32LE(this.updatePosition(4)) |
					this.buffer.readUInt32LE(this.updatePosition(4));
	}

	readIntegerWithLength(bytes: number): number {
		let result = 0;
		for (let i = bytes - 1; i >= 0; i--) {
			result = ((result << 8) | this.buffer[this.offset + i]) >>> 0;
		}
		this.offset += bytes;
		return result;
	}

	readVarInt(): number {
		let result = 0;
		let shift = 0;
		do {
			result +=
				shift < 28
					? (this.buffer[this.offset++] & 0x7f) << shift
					: (this.buffer[this.offset++] & 0x7f) * Math.pow(2, shift);
			shift += 7;
		} while (this.buffer[this.offset++] >= 0x80);
		return result;
	}

	readVarUInt(): number {
		return (this.readVarInt() >>> 1) ^ -(this.readVarInt() & 1);
	}

	writeBoolean(value: boolean): void {
		this.buffer.writeInt8(Number(value), this.updatePosition(1));
	}

	writeByte(value: number): void {
		this.buffer.writeInt8(value, this.updatePosition(1));
	}

	writeBytes(bytes: ByteArray, offset = 0, length = 0): void {
		if (offset === undefined || offset < 0 || offset >= bytes.length) {
			offset = 0;
		}
		let endOffset;
		if (length === undefined || length === 0) {
			endOffset = bytes.length;
		} else {
			endOffset = offset + length;
			if (endOffset < 0 || endOffset > bytes.length) {
				endOffset = bytes.length;
			}
		}
		if (Array.isArray(bytes)) {
			for (let i = 0; i < bytes.length; i++) {
				this.writeByte(bytes.buffer[i]);
			}
		} else {
			for (let i = offset; i < endOffset && this.bytesAvailable > 0; i++) {
				this.writeByte(bytes.buffer[i]);
			}
		}
	}

	writeDouble(value: number): number {
		return this.endian === Values.BIG_ENDIAN
			? this.buffer.writeDoubleBE(value, this.updatePosition(8))
			: this.buffer.writeDoubleLE(value, this.updatePosition(8));
	}

	writeFloat(value: number): number {
		return this.endian === Values.BIG_ENDIAN
			? this.buffer.writeFloatBE(value, this.updatePosition(4))
			: this.buffer.writeFloatLE(value, this.updatePosition(4));
	}

	writeInt(value: number): number {
		return this.endian === Values.BIG_ENDIAN
			? this.buffer.writeInt32BE(value, this.updatePosition(4))
			: this.buffer.writeInt32LE(value, this.updatePosition(4));
	}

	writeMultiByte(str: string, charset: BufferEncoding = "utf8"): void {
		const length = Buffer.byteLength(str);
		this.buffer.write(str, this.updatePosition(length), length, charset);
	}

	writeShort(value: number): void {
		this.endian === Values.BIG_ENDIAN
			? this.buffer.writeInt16BE(value, this.updatePosition(2))
			: this.buffer.writeInt16LE(value, this.updatePosition(2));
	}

	writeUnsignedByte(value: number): void {
		this.buffer.writeUInt8(value, this.updatePosition(1));
	}

	writeUnsignedInt(value: number): void {
		this.endian === Values.BIG_ENDIAN
			? this.buffer.writeUInt32BE(value, this.updatePosition(4))
			: this.buffer.writeUInt32LE(value, this.updatePosition(4));
	}

	writeUnsignedShort(value: number): void {
		this.endian === Values.BIG_ENDIAN
			? this.buffer.writeUInt16BE(value, this.updatePosition(2))
			: this.buffer.writeUInt16LE(value, this.updatePosition(2));
	}

	writeUTF(str: string): void {
		const length = Buffer.byteLength(str);
		this.writeShort(length);
		this.buffer.write(str, this.offset, (this.offset += length), "utf8");
	}

	writeUTFBytes(str: string): void {
		const length = Buffer.byteLength(str);
		this.buffer.write(str, this.offset, (this.offset += length), "utf8");
	}

	writeChar(value: string): void {
		this.writeUnsignedByte(value.charCodeAt(0));
	}

	writeByteArray(values: number[]): void {
		values.forEach((value) => {
			this.writeByte(value);
		});
	}

	writeShortArray(values: number[]): void {
		values.forEach((value) => {
			this.writeShort(value);
		});
	}

	writeIntArray(values: number[]): void {
		values.forEach((value) => {
			this.writeInt(value);
		});
	}

	writeLong(value: number): void {
		if (value > 0x7fffffffffffffff || value < -0x8000000000000000) {
			throw new RangeError(
				`ByteArray::writeLong - Error: ${value} is out of bounds`
			);
		}
		if (this.offset + 8 > this.length) {
			throw new RangeError(
				`ByteArray::writeLong - Error: ${this.offset + 8} is greater than ${
					this.length
				}`
			);
		}
		const high = Math.floor(value / 0x100000000);
		const low = value - high * 0x100000000;
		this.endian === Values.BIG_ENDIAN
			? this.buffer.writeInt32BE(high, this.updatePosition(4)) |
			  this.buffer.writeInt32BE(low, this.updatePosition(4))
			: this.buffer.writeInt32LE(value % 0x100000000, this.updatePosition(4)) |
			  this.buffer.writeInt32LE(
					Math.floor(value / 0x100000000),
					this.updatePosition(4)
			  );
	}

	writeUnsignedLong(value: number): void {
		if (value > 0xffffffffffffffff || value < 0) {
			throw new RangeError(
				`ByteArray::writeUnsignedLong - Error: ${value} is out of bounds`
			);
		}
		if (this.offset + 8 > this.length) {
			throw new RangeError(
				`ByteArray::writeUnsignedLong - Error: ${
					this.offset + 8
				} is greater than ${this.length}`
			);
		}
		const high = Math.floor(value / 0x100000000);
		const low = value - high * 0x100000000;
		this.endian === Values.BIG_ENDIAN
			? this.buffer.writeUInt32BE(high, this.updatePosition(4)) |
			  this.buffer.writeUInt32BE(low, this.updatePosition(4))
			: this.buffer.writeUInt32LE(value % 0x100000000, this.updatePosition(4)) |
			  this.buffer.writeUInt32LE(
					Math.floor(value / 0x100000000),
					this.updatePosition(4)
			  );
	}

	writeIntegerWithLength(bytes: number, value: number): void {
		if (bytes > Values.MAX_BUFFER_SIZE || value > Values.MAX_BUFFER_SIZE) {
			throw new RangeError(
				`ByteArray::writeIntegerWithLength - Error: ${bytes} | ${value} are out of bounds`
			);
		}
		for (let i = 0; i < bytes; i++) {
			this.buffer[0 + i] = (value >> (i * 8)) & 0xff;
		}
		this.offset += bytes;
	}

	writeVarInt(value: number): void {
		while (value >= Math.pow(2, 31)) {
			this.buffer[this.offset++] = (value & 0xff) | 0x80;
			value /= 128;
		}
		while (value & ~0x7f) {
			this.buffer[this.offset++] = (value & 0xff) | 0x80;
			value >>>= 7;
		}
		this.buffer[this.offset] = value | 0;
	}

	writeVarUInt(value: number): void {
		this.writeVarInt((value << 1) ^ (value >> 31));
	}
}
