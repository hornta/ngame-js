import type { EntityBase } from "./entities/entity-base";
import { GridBase } from "./grid-base";
import type { Vector2 } from "./vector2";

export class GridEntity extends GridBase {
	cells: EntityBase[][];

	constructor(numCols: number, numRows: number, cellSize: number) {
		super(numCols, numRows, cellSize);

		this.cells = [];
		for (let i = 0; i < this.numCells; ++i) {
			this.cells.push([]);
		}
	}

	moveEntity(position: Vector2, entity: EntityBase): void {
		const gridIndex = entity.getGridIndex();
		const cellIndex = this.getCellIndexFromWorldspacePosition(
			position.x,
			position.y
		);
		if (gridIndex !== cellIndex) {
			if (gridIndex === -1) {
				throw new Error(
					`moveEntity() was called with an entity that's not in the grid: ${entity.getId()}`
				);
			} else {
				this.removeEntityFromCell(gridIndex, entity);
				this.insertEntityIntoCell(cellIndex, entity);
				entity.setGridIndex(cellIndex);
			}
		}
	}

	addEntity(position: Vector2, entity: EntityBase): void {
		const gridIndex = entity.getGridIndex();
		if (gridIndex !== -1) {
			throw new Error(
				`addEntity() was called with an entity that's already in the grid: ${entity.getId()}, ${gridIndex}`
			);
		} else {
			const cellIndex = this.getCellIndexFromWorldspacePosition(
				position.x,
				position.y
			);
			this.insertEntityIntoCell(cellIndex, entity);
			entity.setGridIndex(cellIndex);
		}
	}

	removeEntity(entity: EntityBase): void {
		const gridIndex = entity.getGridIndex();
		if (gridIndex == -1) {
			throw new Error(
				`removeEntity() was called with an entity that's not in the grid: ${entity.getId()}`
			);
		} else {
			this.removeEntityFromCell(gridIndex, entity);
			entity.setGridIndex(-1);
		}
	}

	removeEntityFromCell(gridIndex: number, entity: EntityBase): void {
		const cell = this.cells[gridIndex];
		if (!cell.includes(entity_)) {
			throw new Error(
				`WARNING! RemoveEntityFromCell() found an out-of-sync cell index: ${gridIndex}`
			);
		} else {
			cell.splice(cell.indexOf(entity), 1);
		}
	}

	insertEntityIntoCell(cellIndex: number, entity: EntityBase): void {
		const cell = this.cells[cellIndex];
		cell.push(entity);
	}

	gatherCellContentsInNeighbourhood(position: Vector2): EntityBase[] {
		const gridX = this.worldspaceToGridspace(position.x);
		const gridY = this.worldspaceToGridspace(position.y);
		const entities = [];
		for (let x = -1; x < 2; ++x) {
			for (let y = -1; y < 2; ++y) {
				const cellIndex = this.getCellIndexFromGridspacePosition(
					gridX + x,
					gridY + y
				);
				entities.push(...this.cells[cellIndex]);
			}
		}
		return entities;
	}
}
