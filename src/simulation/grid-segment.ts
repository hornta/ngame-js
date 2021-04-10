import { GridBase } from "./grid-base";
import type { Segment } from "./segment";
import type { Vector2 } from "./vector2";

export class GridSegment extends GridBase {
	cells: Segment[][];

	constructor(numCols: number, numRows: number, cellSize: number) {
		super(numCols, numRows, cellSize);

		this.cells = [];
		for (let i = 0; i < this.numCells; ++i) {
			this.cells.push([]);
		}

		this.tmpRayPosition = new Vector2();
		this.tmpRayVector = new Vector2();
		this.tmpP = new Vector2();
		this.tmpN = new Vector2();
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
		param3: Vector2,
		param4: Vector2,
		param5: Vector2,
		param6: Vector2
	): number {
		let _loc7_ = 2;
		const tmpPosition = new Vector2(0, 0);
		const tmpNormal = new Vector2(0, 0);
		const cellIndex = this.getCellIndexFromGridspacePosition(gridX, gridY);
		for (const segment of this.cells[cellIndex]) {
			const _loc12_ = segment.intersectWithRay(
				param3,
				param4,
				0,
				tmpPosition,
				tmpNormal
			);
			if (_loc12_ === -1) {
				return -1;
			}
			if (_loc12_ < _loc7_) {
				_loc7_ = _loc12_;
				param5.setFrom(tmpPosition);
				param6.setFrom(tmpNormal);
			}
		}

		return _loc7_;
	}

	getRaycastDistance(
		x: number,
		y: number,
		param3: number,
		param4: number,
		param5: Vector2,
		param6: Vector2
	): number {
		let _loc17_ = NaN;
		const gridX = this.worldspaceToGridspace(x);
		const gridY = this.worldspaceToGridspace(y);
		let _loc9_ = 0;
		let _loc10_ = 0;
		let _loc11_ = 999999;
		let _loc12_ = 999999;
		let _loc13_ = 0;
		let _loc14_ = 0;
		if (param3 < 0) {
			_loc9_ = -1;
			_loc11_ = (gridX * this.cellSize - x) / param3;
			_loc13_ = this.cellSize / -param3;
		} else if (param3 > 0) {
			_loc9_ = 1;
			_loc11_ = ((gridX + 1) * this.cellSize - x) / param3;
			_loc13_ = this.cellSize / param3;
		}
		if (param4 < 0) {
			_loc10_ = -1;
			_loc12_ = (gridY * this.cellSize - y) / param4;
			_loc14_ = this.cellSize / -param4;
		} else if (param4 > 0) {
			_loc10_ = 1;
			_loc12_ = ((gridY + 1) * this.cellSize - y) / param4;
			_loc14_ = this.cellSize / param4;
		}
		if (_loc9_ === 0 && _loc10_ === 0) {
			throw new Error(
				`WARNING! some jackass called getRaycastDistance() with a null ray vector: ${param3},${param4}`
			);
			return -1;
		}
		const _loc15_ = 2000;
		const tmpRayPosition = new Vector2(x, y);
		const tmpRayVector = new Vector2(_loc15_ * param3, _loc15_ * param4);
		let _loc16_ = 2;

		while (
			(_loc17_ = this.intersectRayVsCellContents(
				gridX,
				gridY,
				tmpRayPosition,
				tmpRayVector,
				param5,
				param6
			)) !== -1
		) {
			if (_loc17_ !== 2) {
				_loc16_ = _loc17_;
				return _loc16_ * _loc15_;
			}
			if (_loc11_ < _loc12_) {
				_loc11_ += _loc13_;
				if ((gridX += _loc9_) < 0 || gridX >= this.numCols) {
					throw new Error(
						"getRaycastDistance() has a ray that missed everything in U"
					);
				}
			} else {
				_loc12_ += _loc14_;
				if ((gridY += _loc10_) < 0 || gridY >= this.numRows) {
					throw new Error(
						"getRaycastDistance() has a ray that missed everything in V"
					);
				}
			}
		}
		throw new Error(
			"getRaycastDistance() was passed an invalid ray (start position overlaps seg geometry)"
		);
	}

	raycastVsPlayer(
		position: Vector2,
		playerPosition: Vector2,
		playerRadius: number,
		hitPosition: Vector2,
		hitNormal: Vector2
	): boolean {
		let _loc6_ = playerPosition.x - position.x;
		let _loc7_ = playerPosition.y - position.y;
		let _loc8_ = Math.sqrt(_loc6_ * _loc6_ + _loc7_ * _loc7_);
		if (_loc8_ < param3) {
			return true;
		}
		_loc6_ /= _loc8_;
		_loc7_ /= _loc8_;
		_loc8_ -= param3;
		const distance = this.getRaycastDistance(
			position.x,
			position.y,
			_loc6_,
			_loc7_,
			hitPosition,
			hitNormal
		);
		if (_loc8_ < distance) {
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

		const cellSegments: Segment[] = this.cells[segmentIndex];

		if (cellSegments.includes(cellSegments)) {
			throw new Error(
				`addDoorSegment() was passed an already-in-grid seg: ${segmentIndex}`
			);
		} else {
			cellSegments.push(segment);
		}
	}

	removeDoorSegment(segmentIndex: number, segment: Segment): void {
		if (segmentIndex < 0 || segmentIndex >= numcells) {
			throw new Error(
				`removeDoorSegment() was called with an invalid index: ${segmentIndex}`
			);
		}
		const cellSegments: Segment[] = this.cells[segmentIndex];
		if (!cellSegments.includes(param2)) {
			throw new Error(
				`removeDoorSegment() couldn't find a seg: ${segmentIndex}`
			);
		} else {
			cellSegments.splice(cellSegments.indexOf(segment), 1);
		}
	}
}
