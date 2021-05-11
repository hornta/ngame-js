import { getEdgeStateX, getEdgeStateY } from "../edge-definitions";
import { EdgeState } from "../enum-data";
import type { GraphicsManager } from "../graphics-manager.js";
import type { TileType } from "../tile-type";
import { GridBase } from "./grid-base";
import { Vector2 } from "./vector2.js";

export class GridEdges extends GridBase {
	edgesTileX: EdgeState[];
	edgesTileY: EdgeState[];
	edgesDoorX: EdgeState[];
	edgesDoorY: EdgeState[];

	constructor(numCols: number, numRows: number, cellSize: number) {
		super(numCols, numRows, cellSize);

		this.edgesTileX = new Array<EdgeState>(this.numCells).fill(0);
		this.edgesTileY = new Array<EdgeState>(this.numCells).fill(0);
		this.edgesDoorX = new Array<EdgeState>(this.numCells).fill(0);
		this.edgesDoorY = new Array<EdgeState>(this.numCells).fill(0);
	}

	clear(): void {
		for (let i = 0; i < this.numCells; ++i) {
			this.edgesTileX[i] = EdgeState.EMPTY;
			this.edgesTileY[i] = EdgeState.EMPTY;
			this.edgesDoorX[i] = 0;
			this.edgesDoorY[i] = 0;
		}
	}

	loadTileEdges(tileX: number, tileY: number, tileType: TileType): void {
		const originX = tileX * 2;
		const originY = tileY * 2;

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 2; j++) {
				const Xu = originX - 1 + i;
				const Xv = originY + j;

				const Yu = originX + j;
				const Yv = originY - 1 + i;

				const Xid = this.getCellIndexFromGridspacePosition(Xu, Xv);
				const Yid = this.getCellIndexFromGridspacePosition(Yu, Yv);

				const offset = i + j * 3;

				this.loadEdgeStateX(Xid, getEdgeStateX(tileType, offset));
				this.loadEdgeStateY(Yid, getEdgeStateY(tileType, offset));
			}
		}
	}

	loadEdgeStateX(index: number, state: EdgeState): void {
		if (
			this.edgesTileX[index] === EdgeState.SOLID &&
			state === EdgeState.SOLID
		) {
			this.edgesTileX[index] = EdgeState.EMPTY;
		} else {
			this.edgesTileX[index] = Math.max(this.edgesTileX[index], state);
		}
	}

	loadEdgeStateY(param1: number, param2: number): void {
		if (
			this.edgesTileY[param1] === EdgeState.SOLID &&
			param2 === EdgeState.SOLID
		) {
			this.edgesTileY[param1] = EdgeState.EMPTY;
		} else {
			this.edgesTileY[param1] = Math.max(this.edgesTileY[param1], param2);
		}
	}

	getGridCoordinateFromWorldspace1D(worldCoordinate: number): number {
		return this.worldspaceToGridspace(worldCoordinate);
	}

	public getWorldspaceCoordinateFromGridEdge1D(
		param1: number,
		param2: number
	): number {
		return (param1 + Math.max(0, param2)) * this.cellSize;
	}

	getIndexFromGridspaceAndOffset(
		x: number,
		y: number,
		directionX: number,
		directionY: number
	): number {
		let index = -1;
		if (directionY === 0) {
			if (directionX === -1) {
				index = this.getCellIndexFromGridspacePosition(x - 1, y);
			} else if (directionX === 1) {
				index = this.getCellIndexFromGridspacePosition(x, y);
			}
		} else if (directionX === 0) {
			if (directionY === -1) {
				index = this.getCellIndexFromGridspacePosition(x, y - 1);
			} else if (directionY === 1) {
				index = this.getCellIndexFromGridspacePosition(x, y);
			}
		}
		return index;
	}

	isEmpty(
		param1: number,
		param2: number,
		param3: number,
		param4: number
	): boolean {
		const _loc5_ = this.getIndexFromGridspaceAndOffset(
			param1,
			param2,
			param3,
			param4
		);
		if (param4 === 0) {
			return (
				this.edgesTileX[_loc5_] === EdgeState.EMPTY &&
				this.edgesDoorX[_loc5_] === 0
			);
		}
		return (
			this.edgesTileY[_loc5_] === EdgeState.EMPTY &&
			this.edgesDoorY[_loc5_] === 0
		);
	}

	isEmptyColumn(
		param1: number,
		param2: number,
		param3: number,
		param4: number
	): boolean {
		let _loc5_ = param2;
		while (_loc5_ <= param3) {
			if (!this.isEmpty(param1, _loc5_, param4, 0)) {
				return false;
			}
			_loc5_++;
		}
		return true;
	}

	isEmptyRow(
		y: number,
		minX: number,
		maxX: number,
		direction: number
	): boolean {
		for (let x = minX; x <= maxX; x++) {
			if (!this.isEmpty(x, y, 0, direction)) {
				return false; //we hit something
			}
		}
		return true;
	}

	public scanHorizontal(
		param1: number,
		param2: number,
		param3: number,
		param4: number
	): boolean {
		let _loc6_ = 0;
		let _loc5_;
		if ((_loc5_ = param4 - param3) !== 0) {
			_loc6_ = _loc5_ / Math.abs(_loc5_);
			return this.scanHorizontalDirected(
				param1,
				param2,
				param3,
				param4,
				_loc6_
			);
		}
		return true;
	}

	scanHorizontalDirected(
		param1: number,
		param2: number,
		param3: number,
		param4: number,
		param5: number
	): boolean {
		let _loc6_ = param3;
		while (_loc6_ !== param4) {
			if (!this.isEmptyColumn(_loc6_, param1, param2, param5)) {
				return false;
			}
			_loc6_ += param5;
			if (Math.abs(_loc6_) > 100) {
				throw new Error(
					`-infinite loop in scanHorizontalDirected: ${param1}-${param2} .. ${param3},${param5}`
				);
			}
		}
		return true;
	}

	scanVerticalDirected(
		param1: number,
		param2: number,
		param3: number,
		param4: number,
		param5: number
	): boolean {
		let _loc6_ = param3;
		while (_loc6_ !== param4) {
			if (!this.isEmptyRow(_loc6_, param1, param2, param5)) {
				return false;
			}
			_loc6_ += param5;
			if (Math.abs(_loc6_) > 100) {
				throw new Error(
					`-infinite loop in scanVerticalDirected: ${param1}-${param2} .. ${param3},${param5}`
				);
			}
		}
		return true;
	}

	incrementDoorEdge(edgeIndex: number, isHorizontal: boolean): void {
		if (edgeIndex < 0 || edgeIndex >= this.numCells) {
			throw new Error(
				`incrementDoorEdge() was called with an invalid index: ${edgeIndex}`
			);
		}
		if (isHorizontal) {
			this.edgesDoorX[edgeIndex] += 1;
		} else {
			this.edgesDoorY[edgeIndex] += 1;
		}
	}

	decrementDoorEdge(edgeIndex: number, isHorizontal: boolean): void {
		if (edgeIndex < 0 || edgeIndex >= this.numCells) {
			throw new Error(
				`decrementDoorEdge() was called with an invalid index: ${edgeIndex}`
			);
		}
		if (isHorizontal) {
			if (this.edgesDoorX[edgeIndex] <= 0) {
				throw new Error(
					`decrementDoorEdge() was called on an empty edge! ${edgeIndex}`
				);
			}
			this.edgesDoorX[edgeIndex] = this.edgesDoorX[edgeIndex] - 1;
		} else {
			if (this.edgesDoorY[edgeIndex] <= 0) {
				throw new Error(
					`decrementDoorEdge() was called on an empty edge! ${edgeIndex}`
				);
			}
			this.edgesDoorY[edgeIndex] = this.edgesDoorY[edgeIndex] - 1;
		}
	}

	sweepHorizontal(
		param1: number,
		param2: number,
		param3: number,
		param4: number
	): number {
		let _loc5_ = param3;
		while (this.isEmptyColumn(_loc5_, param1, param2, param4)) {
			_loc5_ += param4;
			if (Math.abs(_loc5_) > 100) {
				throw new Error(
					`-infinite loop in sweepHorizontal: ${param1}-${param2} .. ${param3},${param4}`
				);
			}
		}
		return _loc5_;
	}

	sweepVertical(
		minX: number,
		maxX: number,
		startY: number,
		direction: number
	): number {
		let y = startY;
		while (this.isEmptyRow(y, minX, maxX, direction)) {
			y += direction;
			if (Math.abs(y) > 100) {
				throw new Error(
					`-infinite loop in sweepVertical: ${minX}-${maxX} .. ${startY},${direction}`
				);
			}
		}
		return y;
	}
	public isSolidIgnoreDoors(
		param1: number,
		param2: number,
		param3: number,
		param4: number
	): boolean {
		const _loc5_ = this.getIndexFromGridspaceAndOffset(
			param1,
			param2,
			param3,
			param4
		);
		if (param4 === 0) {
			return this.edgesTileX[_loc5_] === EdgeState.SOLID;
		}
		return this.edgesTileY[_loc5_] === EdgeState.SOLID;
	}

	public debugDraw(gfx: GraphicsManager): void {
		for (let x = 0; x < this.numCols; x++) {
			for (let y = 0; y < this.numRows; y++) {
				const halfWidth = this.cellSize * 0.5;
				const index = this.getCellIndexFromGridspacePosition(x, y);
				const cellPosition = this.debugGetWorldspaceCellCenterPositionFromIndex(
					index
				);

				if (this.edgesTileX[index] !== EdgeState.EMPTY) {
					if (this.edgesTileX[index] === EdgeState.PARTIAL) {
						gfx.setStyle("#aaaaaa", 0.4);
					} else {
						gfx.setStyle("#222222", 0.4);
					}
					gfx.renderLine(
						new Vector2(
							cellPosition.x + halfWidth - 2,
							cellPosition.y - halfWidth + 2
						),
						new Vector2(
							cellPosition.x + halfWidth - 2,
							cellPosition.y + halfWidth - 2
						)
					);
				}
				if (this.edgesTileY[index] !== EdgeState.EMPTY) {
					if (this.edgesTileY[index] === EdgeState.PARTIAL) {
						gfx.setStyle("#aaaaaa", 0.4);
					} else {
						gfx.setStyle("#222222", 0.4);
					}
					gfx.renderLine(
						new Vector2(
							cellPosition.x - halfWidth + 2,
							cellPosition.y + halfWidth - 2
						),
						new Vector2(
							cellPosition.x + halfWidth - 2,
							cellPosition.y + halfWidth - 2
						)
					);
				}

				gfx.setStyle("#228822", 1);
				if (this.edgesDoorX[index] !== 0) {
					gfx.renderAABB(
						cellPosition.x + halfWidth - 2,
						cellPosition.x + halfWidth + 2,
						cellPosition.y - halfWidth + 2,
						cellPosition.y + halfWidth - 2
					);
				}
				if (this.edgesDoorY[index] !== 0) {
					gfx.renderAABB(
						cellPosition.x - halfWidth + 2,
						cellPosition.x + halfWidth - 2,
						cellPosition.y + halfWidth - 2,
						cellPosition.y + halfWidth + 2
					);
				}
			}
		}
	}
}
