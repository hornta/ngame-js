import type { EntityGraphics } from "./entity-graphics.js";
import type { EntityGraphicsNinja } from "./graphics/entity-graphics-ninja.js";
import type { EntityBase } from "./simulation/entities/entity-base.js";
import { EntityGold } from "./simulation/entities/entity-gold.js";
import { EntityMine } from "./simulation/entities/entity-mine.js";
import type { Ninja } from "./simulation/ninja.js";
import { Simulator } from "./simulation/simulator.js";
import { TileType } from "./tile-type.js";

class Tile {
	x: number;
	y: number;
	type: TileType;
	private color = 0x797988;
	private currentFrame: number;
	private isPlaying: boolean;

	constructor(x: number, y: number, type: TileType) {
		this.x = x;
		this.y = y;
		this.type = type;
	}

	render(ctx: CanvasRenderingContext2D) {
		console.log(1);
	}

	goToAndStop(frame: number): void {}

	stop() {
		this.isPlaying = false;
	}
}

export class GraphicsManager {
	private entityGFXList: EntityBase[];
	private playerGFXList: Ninja[];
	private numRows: number;
	private numCols: number;
	private canvas: HTMLCanvasElement;
	private tiles: Tile[];
	private ctx: CanvasRenderingContext2D;
	private width: number;
	private height: number;
	private scale = 1;
	private fixedCellSize: number;

	setContext(context: CanvasRenderingContext2D): void {
		context.imageSmoothingEnabled = false;
		this.ctx = context;
	}

	public getContext(): CanvasRenderingContext2D {
		return this.ctx;
	}

	setWidthAndHeight(width: number, height: number): void {
		this.width = width;
		this.height = height;
		const scale =
			this.width / (Simulator.GRID_CELL_SIZE * Simulator.GRID_NUM_COLUMNS);

		const xAcc = 0;
		const yAcc = 0;

		const newCellSize = Math.floor(Simulator.GRID_CELL_SIZE * scale);

		if (newCellSize !== this.fixedCellSize) {
			this.scale = newCellSize / Simulator.GRID_CELL_SIZE;
			this.fixedCellSize = newCellSize;
			console.log("new cell size", newCellSize, "scale:", this.scale);

			if (this.tiles) {
				for (let x = 0; x < this.numCols; ++x) {
					for (let y = 0; y < this.numRows; ++y) {
						const index = x + y * this.numCols;
						const xPos = x * this.fixedCellSize;
						const yPos = y * this.fixedCellSize;

						this.tiles[index].x = xPos - xAcc;
						this.tiles[index].y = yPos - yAcc;
						// xAcc += xPos - Math.floor(xPos);
						// yAcc += yPos - Math.floor(yPos);
					}
				}
			}
		}
	}

	setData(
		entities: EntityBase[],
		players: Ninja[],
		tileIDs: TileType[],
		numRows: number,
		numCols: number
	): void {
		this.numRows = numRows;
		this.numCols = numCols;
		this.tiles = new Array<Tile>(numCols * numRows);
		for (let x = 0; x < numCols; ++x) {
			for (let y = 0; y < numRows; ++y) {
				const index = x + y * this.numCols;
				const type = tileIDs[index];
				const xPos = x * Simulator.GRID_CELL_SIZE * this.scale;
				const yPos = y * Simulator.GRID_CELL_SIZE * this.scale;
				const tileGraphic = new Tile(xPos, yPos, type);
				this.tiles[index] = tileGraphic;
			}
		}

		this.entityGFXList = entities;
		this.playerGFXList = players;
	}

	render(): void {
		this.ctx.fillStyle = "#cacad0";
		this.ctx.fillRect(0, 0, 99999, 99999);

		for (const entity of this.entityGFXList) {
			// entity.updateState();
			if (entity instanceof EntityMine) {
				const radius = entity.radius * 0.6 * this.scale;
				this.ctx.strokeStyle = "#990000";
				this.ctx.lineWidth = 0.6 * this.scale;
				const spokeLength = 2 * this.scale;
				const spokeDiagonalLength = Math.sqrt(spokeLength);
				this.ctx.beginPath();
				this.ctx.moveTo(
					entity.position.x * this.scale,
					entity.position.y * this.scale
				);
				this.ctx.lineTo(
					entity.position.x * this.scale,
					entity.position.y * this.scale + radius + spokeLength
				);
				this.ctx.moveTo(
					entity.position.x * this.scale,
					entity.position.y * this.scale
				);
				this.ctx.lineTo(
					entity.position.x * this.scale,
					entity.position.y * this.scale - radius - spokeLength
				);
				this.ctx.moveTo(
					entity.position.x * this.scale,
					entity.position.y * this.scale
				);
				this.ctx.lineTo(
					entity.position.x * this.scale - radius - spokeLength,
					entity.position.y * this.scale
				);
				this.ctx.moveTo(
					entity.position.x * this.scale,
					entity.position.y * this.scale
				);
				this.ctx.lineTo(
					entity.position.x * this.scale + radius + spokeLength,
					entity.position.y * this.scale
				);
				this.ctx.moveTo(
					entity.position.x * this.scale,
					entity.position.y * this.scale
				);
				this.ctx.lineTo(
					entity.position.x * this.scale + radius + spokeDiagonalLength,
					entity.position.y * this.scale + radius + spokeDiagonalLength
				);
				this.ctx.moveTo(
					entity.position.x * this.scale,
					entity.position.y * this.scale
				);
				this.ctx.lineTo(
					entity.position.x * this.scale + radius + spokeDiagonalLength,
					entity.position.y * this.scale - radius - spokeDiagonalLength
				);
				this.ctx.moveTo(
					entity.position.x * this.scale,
					entity.position.y * this.scale
				);
				this.ctx.lineTo(
					entity.position.x * this.scale - radius - spokeDiagonalLength,
					entity.position.y * this.scale + radius + spokeDiagonalLength
				);
				this.ctx.moveTo(
					entity.position.x * this.scale,
					entity.position.y * this.scale
				);
				this.ctx.lineTo(
					entity.position.x * this.scale - radius - spokeDiagonalLength,
					entity.position.y * this.scale - radius - spokeDiagonalLength
				);
				this.ctx.stroke();

				this.ctx.fillStyle = "black";
				this.ctx.lineWidth = 0.5 * this.scale;
				this.ctx.lineCap = "round";
				this.ctx.lineJoin = "round";
				this.ctx.beginPath();
				this.ctx.arc(
					entity.position.x * this.scale,
					entity.position.y * this.scale,
					radius,
					0,
					Math.PI * 2
				);
				this.ctx.fill();
				this.ctx.stroke();
			} else if (entity instanceof EntityGold) {
				const glimmerColor = "#ffffcc";
				const firstLayer = "#cc9900";
				const secondLayer = "#dbbd11";
				const thirdLayer = "#e2e200";
				const strokeColor = "#a67c00";

				this.ctx.fillStyle = firstLayer;
				this.ctx.strokeStyle = strokeColor;
				this.ctx.lineWidth = 1 * this.scale;
				this.ctx.lineJoin = "miter";
				let size = 6 * this.scale;
				this.ctx.beginPath();
				this.ctx.rect(
					entity.position.x * this.scale - size / 2,
					entity.position.y * this.scale - size / 2,
					size,
					size
				);
				this.ctx.stroke();
				this.ctx.fill();

				this.ctx.fillStyle = secondLayer;
				size = 4 * this.scale;
				this.ctx.fillRect(
					entity.position.x * this.scale - size / 2,
					entity.position.y * this.scale - size / 2,
					size,
					size
				);

				this.ctx.fillStyle = thirdLayer;
				size = 2 * this.scale;
				this.ctx.fillRect(
					entity.position.x * this.scale - size / 2,
					entity.position.y * this.scale - size / 2,
					size,
					size
				);

				this.ctx.fillStyle = glimmerColor;
				size = 1 * this.scale * 1.6;
				this.ctx.fillRect(
					entity.position.x * this.scale - size / 2 + 1.4 * this.scale,
					entity.position.y * this.scale - size / 2 - 1.4 * this.scale,
					size,
					size
				);
			}
		}

		for (const player of this.playerGFXList) {
			this.ctx.fillStyle = "black";
			const width = 3 * this.scale;
			const height = 6 * this.scale;
			this.ctx.fillRect(
				player.position.x * this.scale,
				player.position.y * this.scale - height,
				width,
				height
			);
		}
		for (const tile of this.tiles) {
			this.ctx.fillStyle = "#797988";
			if (
				tile.type === TileType.FULL ||
				tile.type === TileType.EDGE_BOTTOM ||
				tile.type === TileType.EDGE_TOP ||
				tile.type === TileType.EDGE_RIGHT ||
				tile.type === TileType.EDGE_LEFT ||
				tile.type === TileType.EDGE_CORNER_DL ||
				tile.type === TileType.EDGE_CORNER_DR ||
				tile.type === TileType.EDGE_CORNER_UL ||
				tile.type === TileType.EDGE_CORNER_UR
			) {
				this.ctx.fillRect(
					tile.x,
					tile.y,
					this.fixedCellSize,
					this.fixedCellSize
				);
			} else if (tile.type === TileType.HALF_BOTTOM) {
				this.ctx.fillRect(
					tile.x,
					tile.y + this.fixedCellSize / 2,
					this.fixedCellSize,
					this.fixedCellSize / 2
				);
			} else if (tile.type === TileType.HALF_TOP) {
				this.ctx.fillRect(
					tile.x,
					tile.y,
					this.fixedCellSize,
					this.fixedCellSize / 2
				);
			} else if (tile.type === TileType.HALF_LEFT) {
				this.ctx.fillRect(
					tile.x,
					tile.y,
					this.fixedCellSize / 2,
					this.fixedCellSize
				);
			} else if (tile.type === TileType.HALF_RIGHT) {
				this.ctx.fillRect(
					tile.x + this.fixedCellSize / 2,
					tile.y,
					this.fixedCellSize / 2,
					this.fixedCellSize
				);
			} else if (tile.type === TileType.MED_PP) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y);
				this.ctx.lineTo(tile.x + this.fixedCellSize, tile.y);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.MED_NP) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y);
				this.ctx.lineTo(tile.x + this.fixedCellSize, tile.y);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize
				);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.MED_PN) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize
				);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.MED_NN) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x + this.fixedCellSize, tile.y);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize
				);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.SMALL_67_NN) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x + this.fixedCellSize, tile.y);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize
				);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize / 2,
					tile.y + this.fixedCellSize
				);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.SMALL_67_PN) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize / 2,
					tile.y + this.fixedCellSize
				);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.SMALL_67_NP) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x + this.fixedCellSize / 2, tile.y);
				this.ctx.lineTo(tile.x + this.fixedCellSize, tile.y);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize
				);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.SMALL_67_PP) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y);
				this.ctx.lineTo(tile.x + this.fixedCellSize / 2, tile.y);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.LARGE_67_NN) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x + this.fixedCellSize / 2, tile.y);
				this.ctx.lineTo(tile.x + this.fixedCellSize, tile.y);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize
				);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.LARGE_67_PN) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y);
				this.ctx.lineTo(tile.x + this.fixedCellSize / 2, tile.y);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize
				);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.LARGE_67_NP) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y);
				this.ctx.lineTo(tile.x + this.fixedCellSize, tile.y);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize
				);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize / 2,
					tile.y + this.fixedCellSize
				);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.LARGE_67_PP) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y);
				this.ctx.lineTo(tile.x + this.fixedCellSize, tile.y);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize / 2,
					tile.y + this.fixedCellSize
				);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.SMALL_22_NN) {
				this.ctx.beginPath();
				this.ctx.moveTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize / 2
				);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize
				);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.SMALL_22_PN) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y + this.fixedCellSize / 2);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize
				);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.SMALL_22_NP) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y);
				this.ctx.lineTo(tile.x + this.fixedCellSize, tile.y);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize / 2
				);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.SMALL_22_PP) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y);
				this.ctx.lineTo(tile.x + this.fixedCellSize, tile.y);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize / 2);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.LARGE_22_NN) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x + this.fixedCellSize, tile.y);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize
				);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize / 2);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.LARGE_22_PN) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize / 2
				);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize
				);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.LARGE_22_NP) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y);
				this.ctx.lineTo(tile.x + this.fixedCellSize, tile.y);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize
				);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize / 2);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.LARGE_22_PP) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y);
				this.ctx.lineTo(tile.x + this.fixedCellSize, tile.y);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize / 2
				);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.CONCAVE_NN) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y + this.fixedCellSize);
				this.ctx.arcTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize,
					tile.x + this.fixedCellSize,
					tile.y,
					this.fixedCellSize
				);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize
				);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.CONCAVE_PN) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y);
				this.ctx.arcTo(
					tile.x,
					tile.y + this.fixedCellSize,
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize,
					this.fixedCellSize
				);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.CONCAVE_NP) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x + this.fixedCellSize, tile.y);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize
				);
				this.ctx.arcTo(
					tile.x + this.fixedCellSize,
					tile.y,
					tile.x,
					tile.y,
					this.fixedCellSize
				);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.CONCAVE_PP) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y);
				this.ctx.lineTo(tile.x + this.fixedCellSize, tile.y);
				this.ctx.arcTo(
					tile.x,
					tile.y,
					tile.x,
					tile.y + this.fixedCellSize,
					this.fixedCellSize
				);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.CONVEX_NN) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y + this.fixedCellSize);
				this.ctx.arcTo(
					tile.x,
					tile.y,
					tile.x + this.fixedCellSize,
					tile.y,
					this.fixedCellSize
				);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize
				);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.CONVEX_PN) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y);
				this.ctx.arcTo(
					tile.x + this.fixedCellSize,
					tile.y,
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize,
					this.fixedCellSize
				);
				this.ctx.lineTo(tile.x, tile.y + this.fixedCellSize);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.CONVEX_NP) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x + this.fixedCellSize, tile.y);
				this.ctx.lineTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize
				);
				this.ctx.arcTo(
					tile.x,
					tile.y + this.fixedCellSize,
					tile.x,
					tile.y,
					this.fixedCellSize
				);
				this.ctx.closePath();
				this.ctx.fill();
			} else if (tile.type === TileType.CONVEX_PP) {
				this.ctx.beginPath();
				this.ctx.moveTo(tile.x, tile.y);
				this.ctx.lineTo(tile.x + this.fixedCellSize, tile.y);
				this.ctx.arcTo(
					tile.x + this.fixedCellSize,
					tile.y + this.fixedCellSize,
					tile.x,
					tile.y + this.fixedCellSize,
					this.fixedCellSize
				);
				this.ctx.closePath();
				this.ctx.fill();
			}

			/*16}
					[200 … 299]
					200: Tile {color: 7960968, x: 60, y: 180, type: 17}
					201: Tile {color: 7960968, x: 90, y: 180, type: 15}
					202: Tile {color: 7960968, x: 120, y: 180, type: 14*/
		}

		for (const player of this.playerGFXList) {
			// player.updateState();
		}
	}
}
