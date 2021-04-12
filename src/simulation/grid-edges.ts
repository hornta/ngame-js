import { getEdgeStateX, getEdgeStateY } from "../edge-definitions";
import { EdgeType } from "../enum-data";
import type { TileType } from "../tile-type";
import { GridBase } from "./grid-base";

export class GridEdges extends GridBase {
	edgesTileX: number[];
	edgesTileY: number[];
	edgesDoorX: number[];
	edgesDoorY: number[];

	constructor(numCols: number, numRows: number, cellSize: number) {
		super(numCols, numRows, cellSize);

		this.edgesTileX = new Array<number>(this.numCells).fill(0);
		this.edgesTileY = new Array<number>(this.numCells).fill(0);
		this.edgesDoorX = new Array<number>(this.numCells).fill(0);
		this.edgesDoorY = new Array<number>(this.numCells).fill(0);
	}

	clear(): void {
		for (let i = 0; i < this.numCells; ++i) {
			this.edgesTileX[i] = EdgeType.EMPTY;
			this.edgesTileY[i] = EdgeType.EMPTY;
			this.edgesDoorX[i] = 0;
			this.edgesDoorY[i] = 0;
		}
	}

	loadTileEdges(x: number, y: number, tileType: TileType): void {
		let _loc7_ = 0;
		let _loc8_ = 0;
		let _loc9_ = 0;
		let _loc10_ = 0;
		let _loc11_ = 0;
		let _loc12_ = 0;
		let _loc13_ = 0;
		let _loc14_ = 0;
		const _loc4_ = x * 2;
		const _loc5_ = y * 2;
		let _loc6_ = 0;
		while (_loc6_ < 3) {
			_loc7_ = 0;
			while (_loc7_ < 2) {
				_loc8_ = _loc4_ - 1 + _loc6_;
				_loc9_ = _loc5_ + _loc7_;
				_loc10_ = _loc4_ + _loc7_;
				_loc11_ = _loc5_ - 1 + _loc6_;
				_loc12_ = this.getCellIndexFromGridspacePosition(_loc8_, _loc9_);
				_loc13_ = this.getCellIndexFromGridspacePosition(_loc10_, _loc11_);
				_loc14_ = _loc6_ + _loc7_ * 3;
				this.loadEdgeStateX(_loc12_, getEdgeStateX(tileType, _loc14_));
				this.loadEdgeStateY(_loc13_, getEdgeStateY(tileType, _loc14_));
				_loc7_++;
			}
			_loc6_++;
		}
	}

	loadEdgeStateX(param1: number, param2: number): void {
		if (
			this.edgesTileX[param1] === EdgeType.SOLID &&
			param2 === EdgeType.SOLID
		) {
			this.edgesTileX[param1] = EdgeType.EMPTY;
		} else {
			this.edgesTileX[param1] = Math.max(this.edgesTileX[param1], param2);
		}
	}

	loadEdgeStateY(param1: number, param2: number): void {
		if (
			this.edgesTileY[param1] === EdgeType.SOLID &&
			param2 === EdgeType.SOLID
		) {
			this.edgesTileY[param1] = EdgeType.EMPTY;
		} else {
			this.edgesTileY[param1] = Math.max(this.edgesTileY[param1], param2);
		}
	}

	getGridCoordinateFromWorldspace1D(param1: number): number {
		return this.worldspaceToGridspace(param1);
	}

	getIndexFromGridspaceAndOffset(
		param1: number,
		param2: number,
		param3: number,
		param4: number
	): number {
		let _loc5_ = -1;
		if (param4 === 0) {
			if (param3 === -1) {
				_loc5_ = this.getCellIndexFromGridspacePosition(param1 - 1, param2);
			} else if (param3 === 1) {
				_loc5_ = this.getCellIndexFromGridspacePosition(param1, param2);
			}
		} else if (param3 === 0) {
			if (param4 === -1) {
				_loc5_ = this.getCellIndexFromGridspacePosition(param1, param2 - 1);
			} else if (param4 === 1) {
				_loc5_ = this.getCellIndexFromGridspacePosition(param1, param2);
			}
		}
		return _loc5_;
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
				this.edgesTileX[_loc5_] === EdgeType.EMPTY &&
				this.edgesDoorX[_loc5_] === 0
			);
		}
		return (
			this.edgesTileY[_loc5_] === EdgeType.EMPTY &&
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
		param1: number,
		param2: number,
		param3: number,
		param4: number
	): boolean {
		let _loc5_ = param2;
		while (_loc5_ <= param3) {
			if (!this.isEmpty(_loc5_, param1, 0, param4)) {
				return false;
			}
			_loc5_++;
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
		if (edgeIndex < 0 || edgeIndex >= numcells) {
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
		param1: number,
		param2: number,
		param3: number,
		param4: number
	): number {
		let _loc5_ = param3;
		while (this.isEmptyRow(_loc5_, param1, param2, param4)) {
			_loc5_ += param4;
			if (Math.abs(_loc5_) > 100) {
				throw new Error(
					`-infinite loop in sweepVertical: ${param1}-${param2} .. ${param3},${param4}`
				);
			}
		}
		return _loc5_;
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
			return this.edgesTileX[_loc5_] === EdgeType.SOLID;
		}
		return this.edgesTileY[_loc5_] === EdgeType.SOLID;
	}
}
