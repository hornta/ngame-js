import type { GraphicsManager } from "../graphics-manager.js";
import { GridBase } from "./grid-base";
import type { Segment } from "./segment";
import { Vector2 } from "./vector2.js";

const dummyVector = new Vector2();
const tmpPosition = new Vector2(0, 0);
const tmpNormal = new Vector2(0, 0);

export class GridSegment extends GridBase {
	cells: Segment[][];

	constructor(numCols: number, numRows: number, cellSize: number) {
		super(numCols, numRows, cellSize);

		this.cells = [];
		for (let i = 0; i < this.numCells; ++i) {
			this.cells.push([]);
		}
	}

	clear(): void {
		for (const cells of this.cells) {
			cells.length = 0;
		}
	}

	addSegToCell = (x: number, y: number, segment: Segment): void => {
		const cellIndex = this.getCellIndexFromGridspacePosition(x, y);
		if (cellIndex < 0) {
			throw new Error(
				`addSegToCell() was passed invalid cell coords: ${x},${y}`
			);
			return;
		}
		this.cells[cellIndex].push(segment);
	};

	intersectRayVsCellContents(
		gridX: number,
		gridY: number,
		rayStart: Vector2,
		rayEnd: Vector2,
		outPosition: Vector2,
		outNormal: Vector2
	): number {
		let _loc7_ = 2;
		const cellIndex = this.getCellIndexFromGridspacePosition(gridX, gridY);
		for (const segment of this.cells[cellIndex]) {
			const _loc12_ = segment.intersectWithRay(
				rayStart,
				rayEnd,
				tmpPosition,
				tmpNormal
			);
			if (_loc12_ === -1) {
				return -1;
			}
			if (_loc12_ < _loc7_) {
				_loc7_ = _loc12_;
				outPosition.setFrom(tmpPosition);
				outNormal.setFrom(tmpNormal);
			}
		}

		return _loc7_;
	}

	getRaycastDistance(
		x: number,
		y: number,
		directionX: number,
		directionY: number,
		outPosition: Vector2,
		outNormal: Vector2
	): number {
		let gridX = this.worldspaceToGridspace(x);
		let gridY = this.worldspaceToGridspace(y);
		let stepX = 0;
		let stepY = 0;
		let tMaxX = 9999;
		let tMaxY = 9999;
		let tDeltaX = 0;
		let tDeltaY = 0;

		if (directionX < 0) {
			stepX = -1;
			tMaxX = (gridX * this.cellSize - x) / directionX;
			tDeltaX = this.cellSize / -directionX;
		} else if (directionX > 0) {
			stepX = 1;
			tMaxX = ((gridX + 1) * this.cellSize - x) / directionX;
			tDeltaX = this.cellSize / directionX;
		}

		if (directionY < 0) {
			stepY = -1;
			tMaxY = (gridY * this.cellSize - y) / directionY;
			tDeltaY = this.cellSize / -directionY;
		} else if (directionY > 0) {
			stepY = 1;
			tMaxY = ((gridY + 1) * this.cellSize - y) / directionY;
			tDeltaY = this.cellSize / directionY;
		}

		if (stepX === 0 && stepY === 0) {
			throw new Error(
				`WARNING! some jackass called getRaycastDistance() with a null ray vector: ${directionX},${directionY}`
			);
			return -1;
		}
		const hackyLength = 2000;
		let hitT = 2;

		const rayPosition = new Vector2(x, y);
		const rayVector = new Vector2(
			hackyLength * directionX,
			hackyLength * directionY
		);

		// eslint-disable-next-line no-constant-condition
		while (true) {
			const result = this.intersectRayVsCellContents(
				gridX,
				gridY,
				rayPosition,
				rayVector,
				outPosition,
				outNormal
			);
			if (result === -1) {
				throw new Error(
					"getRaycastDistance() was passed an invalid ray (start position overlaps seg geometry)"
				);
			}

			if (result !== 2) {
				hitT = result;
				break;
			}
			if (tMaxX < tMaxY) {
				tMaxX += tDeltaX;
				gridX += stepX;
				if (gridX < 0 || gridX >= this.numCols) {
					throw new Error(
						"getRaycastDistance() has a ray that missed everything in U"
					);
				}
			} else {
				tMaxY += tDeltaY;
				gridY += stepY;
				if (gridY < 0 || gridY >= this.numRows) {
					throw new Error(
						"getRaycastDistance() has a ray that missed everything in V"
					);
				}
			}
		}
		return hitT * hackyLength;
	}

	raycastVsPlayer(
		position: Vector2,
		playerPosition: Vector2,
		playerRadius: number,
		hitPosition: Vector2 = dummyVector,
		hitNormal: Vector2 = dummyVector
	): boolean {
		let deltaX = playerPosition.x - position.x;
		let deltaY = playerPosition.y - position.y;
		let length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		if (length < playerRadius) {
			return true;
		}
		deltaX /= length;
		deltaY /= length;
		length -= playerRadius;
		const distance = this.getRaycastDistance(
			position.x,
			position.y,
			deltaX,
			deltaY,
			hitPosition,
			hitNormal
		);
		if (length < distance) {
			return true;
		}
		if (distance === -1) {
			hitPosition.x = 0;
			hitPosition.y = 0;
			hitNormal.x = 1;
			hitNormal.y = 0;
			throw new Error("raycastVsPlayer() has a problem ray");
		}
		return false;
	}

	addDoorSegment(segmentIndex: number, segment: Segment): void {
		if (segmentIndex < 0 || segmentIndex >= this.numCells) {
			throw new Error(
				`addDoorSegment() was called with an invalid index: ${segmentIndex}`
			);
		}

		const cellSegments = this.cells[segmentIndex];

		if (cellSegments.includes(segment)) {
			throw new Error(
				`addDoorSegment() was passed an already-in-grid seg: ${segmentIndex}`
			);
		} else {
			cellSegments.push(segment);
		}
	}

	removeDoorSegment(segmentIndex: number, segment: Segment): void {
		if (segmentIndex < 0 || segmentIndex >= this.numCells) {
			throw new Error(
				`removeDoorSegment() was called with an invalid index: ${segmentIndex}`
			);
		}
		const cellSegments: Segment[] = this.cells[segmentIndex];
		if (!cellSegments.includes(segment)) {
			throw new Error(
				`removeDoorSegment() couldn't find a seg: ${segmentIndex}`
			);
		} else {
			cellSegments.splice(cellSegments.indexOf(segment), 1);
		}
	}

	public gatherCellContentsFromWorldspaceRegion = (
		param1: number,
		param2: number,
		param3: number,
		param4: number
	): Segment[] => {
		const _loc6_ = this.worldspaceToGridspace(param1);
		const _loc7_ = this.worldspaceToGridspace(param3);
		const _loc8_ = this.worldspaceToGridspace(param2);
		const _loc9_ = this.worldspaceToGridspace(param4);
		const segments = [] as Segment[];

		for (let y = _loc8_; y <= _loc9_; ++y) {
			for (let x = _loc6_; x <= _loc7_; ++x) {
				const cellIndex = this.getCellIndexFromGridspacePosition(x, y);
				if (cellIndex < 0) {
					throw new Error(
						`gatherCellContentsFromWorldspaceRegion() was passed an invalid region: ${_loc6_},${_loc8_} .. ${_loc7_},${_loc9_}`
					);
				}
				segments.push(...this.cells[cellIndex]);
			}
		}

		return segments;
	};

	public debugDraw(gfx: GraphicsManager): void {
		for (const rowOfCells of this.cells) {
			for (const cell of rowOfCells) {
				cell.debugDraw(gfx);
			}
		}
	}
}
