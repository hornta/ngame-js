import type { EntityGraphics } from "./graphics/entity-graphics.js";
import type { EntityGraphicsNinja } from "./graphics/entity-graphics-ninja.js";
import type { EntityBase } from "./simulation/entities/entity-base.js";
import { EntityGold } from "./simulation/entities/entity-gold.js";
import { EntityMine } from "./simulation/entities/entity-mine.js";
import type { Ninja } from "./simulation/ninja.js";
import { Simulator } from "./simulation/simulator.js";
import { Vector2 } from "./simulation/vector2.js";
import { TileType } from "./tile-type.js";
import { EntityBounceBlock } from "./simulation/entities/entity-bounce-block.js";
import { EntityLaunchPad } from "./simulation/entities/entity-launch-pad.js";
import { EntityThwomp } from "./simulation/entities/entity-thwomp.js";
import { EntityExitSwitch } from "./simulation/entities/entity-exit-switch.js";
import { EntityExitDoor } from "./simulation/entities/entity-exit-door.js";

class Tile {
	x: number;
	y: number;
	type: TileType;
	private color = 0x797988;
	private currentFrame = 0;
	private isPlaying = false;

	constructor(x: number, y: number, type: TileType) {
		this.x = x;
		this.y = y;
		this.type = type;
	}

	render(ctx: CanvasRenderingContext2D) {}

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
	private nearestX: number;
	private nearestY: number;

	private x(v: number) {
		return Math.round(v + this.nearestX) - this.nearestX;
	}

	private y(v: number) {
		return Math.round(v + this.nearestY) - this.nearestY;
	}

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
			// console.log("new cell size", newCellSize, "scale:", this.scale);

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

	shape893() {
		this.ctx.fillStyle = "#b4b7c2";
		this.ctx.fill(
			new Path2D("M 0 -240 L 0 240 -100 139 -100 -139 0 -240"),
			"evenodd"
		);
		this.ctx.strokeStyle = "#383838";
		this.ctx.lineWidth = 20 * this.scale;
		this.ctx.lineCap = "round";
		this.ctx.lineJoin = "round";
		this.ctx.stroke(new Path2D("M 0 -240 L 0 240"));

		this.ctx.strokeStyle = "#8f94a7";
		this.ctx.lineWidth = 10 * this.scale;
		this.ctx.lineCap = "round";
		this.ctx.lineJoin = "round";
		this.ctx.stroke(new Path2D("M 0 240 L -100 139 -100 -139 0 -240 Z"));
	}

	shape901() {
		this.ctx.fillStyle = "#838383";
		this.ctx.fill(
			new Path2D(
				"M 144 -180 L 180 -180 180 180 144 180 -180 180 -180 -180 144 -180 144 180 144 -180"
			),
			"evenodd"
		);
		this.ctx.strokeStyle = "#00ccff";
		this.ctx.lineWidth = 10 * this.scale;
		this.ctx.lineCap = "round";
		this.ctx.lineJoin = "round";
		this.ctx.stroke(new Path2D("M 180 -180 L 180 180 M 144 -180 L 144 180"));

		this.ctx.strokeStyle = "#484848";
		this.ctx.lineWidth = 10 * this.scale;
		this.ctx.lineCap = "round";
		this.ctx.lineJoin = "round";
		this.ctx.stroke(new Path2D("M 144 180 L -180 180 -180 -180 144 -180"));
	}

	shape967() {
		this.ctx.fillStyle = "#b3b3bb";
		this.ctx.beginPath();
		this.ctx.moveTo(-6 * this.scale, -3.75 * this.scale);
		this.ctx.lineTo(6 * this.scale, -3.75 * this.scale);
		this.ctx.lineTo(6 * this.scale, 3.75 * this.scale);
		this.ctx.lineTo(-6 * this.scale, 3.75 * this.scale);
		this.ctx.closePath();
		this.ctx.fill("evenodd");

		this.ctx.strokeStyle = "#585863";
		this.ctx.lineWidth = 1;
		this.ctx.lineCap = "round";
		this.ctx.lineJoin = "round";
		this.ctx.beginPath();
		this.ctx.moveTo(this.x(-6 * this.scale), this.y(-3.75 * this.scale));
		this.ctx.lineTo(this.x(6 * this.scale), this.y(-3.75 * this.scale));
		this.ctx.lineTo(this.x(6 * this.scale), this.y(3.75 * this.scale));
		this.ctx.lineTo(this.x(-6 * this.scale), this.y(3.75 * this.scale));
		this.ctx.lineTo(this.x(-6 * this.scale), this.y(-3.75 * this.scale));
		this.ctx.closePath();
		this.ctx.stroke();

		this.ctx.fillStyle = "#b5cae1";
		this.ctx.beginPath();
		this.ctx.moveTo(-3.75 * this.scale, 2.25 * this.scale);
		this.ctx.lineTo(0, 0);
		this.ctx.lineTo(3.75 * this.scale, 2.25 * this.scale);
		this.ctx.lineTo(0, 0);
		this.ctx.lineTo(-3.75 * this.scale, 2.25 * this.scale);
		this.ctx.lineTo(-3.75 * this.scale, -2.25 * this.scale);
		this.ctx.lineTo(3.75 * this.scale, -2.25 * this.scale);
		this.ctx.lineTo(3.75 * this.scale, 2.25 * this.scale);
		this.ctx.lineTo(-3.75 * this.scale, 2.25 * this.scale);
		this.ctx.moveTo(-3.75 * this.scale, -2.25 * this.scale);
		this.ctx.lineTo(0, 0);
		this.ctx.lineTo(3.75 * this.scale, -2.25 * this.scale);
		this.ctx.lineTo(0, 0);
		this.ctx.closePath();
		this.ctx.fill("evenodd");

		this.ctx.strokeStyle = "#6994c2";
		this.ctx.lineWidth = 1;
		this.ctx.lineCap = "round";
		this.ctx.lineJoin = "round";
		this.ctx.beginPath();
		this.ctx.moveTo(this.x(3.75 * this.scale), this.y(2.25 * this.scale));
		this.ctx.lineTo(this.x(0), this.y(0));
		this.ctx.lineTo(this.x(-3.75 * this.scale), this.y(2.25 * this.scale));
		this.ctx.moveTo(this.x(3.75 * this.scale), this.y(-2.25 * this.scale));
		this.ctx.lineTo(this.x(0), this.y(0));
		this.ctx.lineTo(this.x(-3.75 * this.scale), this.y(-2.25 * this.scale));
		this.ctx.stroke();

		this.ctx.strokeStyle = "#34343a";
		this.ctx.lineWidth = 1;
		this.ctx.lineCap = "square";
		this.ctx.lineJoin = "bevel";
		this.ctx.beginPath();
		this.ctx.moveTo(this.x(-3.75 * this.scale), this.y(2.25 * this.scale));
		this.ctx.lineTo(this.x(3.75 * this.scale), this.y(2.25 * this.scale));
		this.ctx.lineTo(this.x(3.75 * this.scale), this.y(-2.25 * this.scale));
		this.ctx.lineTo(this.x(-3.75 * this.scale), this.y(-2.25 * this.scale));
		this.ctx.closePath();
		this.ctx.stroke();
	}

	shape970() {
		this.ctx.fillStyle = "#a48cb9";
		this.ctx.fill(
			new Path2D("M 30 -75 L 30 -36 -240 234 -240 -240 30 -240 30 -75"),
			"evenodd"
		);

		this.ctx.fillStyle = "#ba9eb5";
		this.ctx.fill(
			new Path2D(
				"M -240 234 L 30 -36 30 -75 240 -75 240 240 -240 240 -240 234"
			),
			"evenodd"
		);

		this.ctx.fillStyle = "#a56391";
		this.ctx.fill(
			new Path2D("M 30 -75 L 30 -240 240 -240 240 -75 30 -75"),
			"evenodd"
		);
	}

	shape984() {
		this.ctx.fillStyle = "#b0b0b9";
		this.ctx.fill(
			new Path2D(
				"M 0 -87 L 0 -150 94 -150 100 -150 100 -41 100 -37 100 -34 95 -37 94 -37 0 -87 M 100 35 L 100 143 100 146 100 150 0 150 0 95 100 35"
			),
			"evenodd"
		);
		this.ctx.fillStyle = "#878794";
		this.ctx.fill(
			new Path2D("M 100 -34 L 100 35 0 95 0 -87 94 -37 95 -37 100 -34"),
			"evenodd"
		);
		this.ctx.strokeStyle = "#4b4b54";
		this.ctx.lineWidth = 10 * this.scale;
		this.ctx.lineCap = "round";
		this.ctx.lineJoin = "round";
		this.ctx.stroke(
			new Path2D(
				"M 0 -87 L 0 -150 94 -150 100 -150 100 -41 100 -37 100 -34 100 35 100 143 100 146 100 150 0 150 0 95 0 -87 Z"
			)
		);
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
			} else if (entity instanceof EntityBounceBlock) {
				this.setStyle("#666", 1);
				this.ctx.fillStyle = "#ccc";
				this.renderSquare(entity.position.x, entity.position.y, entity.radius);
			} else if (entity instanceof EntityLaunchPad) {
				this.ctx.save();
				this.ctx.translate(
					entity.position.x * this.scale,
					entity.position.y * this.scale
				);
				this.ctx.rotate(Math.atan2(entity.normal.y, entity.normal.x));
				this.ctx.scale(0.05 * this.scale, 0.05 * this.scale);
				this.shape984();
				this.ctx.restore();
			} else if (entity instanceof EntityThwomp) {
				this.ctx.save();
				this.ctx.translate(
					entity.position.x * this.scale,
					entity.position.y * this.scale
				);
				let rotation = 0;
				if (entity.isHorizontal) {
					if (entity.falldir < 0) {
						rotation = Math.PI;
					}
				} else if (entity.fallDirection < 0) {
					rotation = 1.5 * Math.PI;
				} else {
					rotation = 0.5 * Math.PI;
				}
				this.ctx.rotate(rotation);
				this.ctx.scale(0.05 * this.scale, 0.05 * this.scale);
				this.shape901();
				this.ctx.restore();
			} else if (entity instanceof EntityExitSwitch) {
				this.ctx.save();
				this.ctx.translate(
					entity.position.x * this.scale,
					entity.position.y * this.scale
				);
				this.nearestX = this.ctx.getTransform().e % 1 === 0.5 ? 1 : 0.5;
				this.nearestY = this.ctx.getTransform().f % 1 === 0.5 ? 1 : 0.5;
				this.shape967();
				this.ctx.restore();
			} else if (entity instanceof EntityExitDoor) {
				this.ctx.save();
				this.ctx.translate(
					entity.position.x * this.scale,
					entity.position.y * this.scale
				);
				this.ctx.scale(0.05 * this.scale, 0.05 * this.scale);
				this.shape970();
				this.ctx.restore();
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

	public renderLine(point0: Vector2, point1: Vector2, color = "black"): void {
		this.ctx.strokeStyle = color;
		this.ctx.beginPath();
		this.ctx.lineWidth = 1 * this.scale;
		this.ctx.moveTo(point0.x * this.scale, point0.y * this.scale);
		this.ctx.lineTo(point1.x * this.scale, point1.y * this.scale);
		this.ctx.stroke();
	}

	public renderSquare(x: number, y: number, size = 2): void {
		this.renderAABB(x - size, x + size, y - size, y + size);
	}

	public renderAABB(x1: number, x2: number, y1: number, y2: number): void {
		this.ctx.beginPath();
		this.ctx.moveTo(x1 * this.scale, y1 * this.scale);
		this.ctx.lineTo(x1 * this.scale, y2 * this.scale);
		this.ctx.lineTo(x2 * this.scale, y2 * this.scale);
		this.ctx.lineTo(x2 * this.scale, y1 * this.scale);
		this.ctx.lineTo(x1 * this.scale, y1 * this.scale);
		this.ctx.stroke();
	}

	public setStyle(strokeColor: string, lineWidth: number): void {
		this.ctx.lineWidth = lineWidth;
		this.ctx.strokeStyle = strokeColor;
	}

	public renderPlus(param1: number, param2: number, param3 = 2): void {
		this.ctx.beginPath();
		this.ctx.moveTo((param1 - param3) * this.scale, param2 * this.scale);
		this.ctx.lineTo((param1 + param3) * this.scale, param2 * this.scale);
		this.ctx.moveTo(param1 * this.scale, (param2 - param3) * this.scale);
		this.ctx.lineTo(param1 * this.scale, (param2 + param3) * this.scale);
		this.ctx.stroke();
	}

	public renderBox(
		param1: number,
		param2: number,
		param3: number,
		param4: number,
		param5: number,
		param6: number
	): void {
		this.ctx.beginPath();
		this.ctx.moveTo(
			(param1 + param3 + param5) * this.scale,
			(param2 + param4 + param6) * this.scale
		);
		this.ctx.lineTo(
			(param1 + param3 - param5) * this.scale,
			(param2 + param4 - param6) * this.scale
		);
		this.ctx.lineTo(
			(param1 - param3 - param5) * this.scale,
			(param2 - param4 - param6) * this.scale
		);
		this.ctx.lineTo(
			(param1 - param3 + param5) * this.scale,
			(param2 - param4 + param6) * this.scale
		);
		this.ctx.closePath();
	}

	public renderArcConvex(
		param1: number,
		param2: number,
		param3: number,
		param4: number,
		param5: number,
		param6: number,
		param7: number
	): void {
		const _loc8_ =
			(param4 - param2) * (param5 - param1) -
			(param3 - param1) * (param6 - param2);
		if (_loc8_ <= 0) {
			this.renderArc(param1, param2, param3, param4, param5, param6, -param7);
		} else {
			this.renderArc(param1, param2, param3, param4, param5, param6, param7);
		}
	}

	public renderArc(
		param1: number,
		param2: number,
		param3: number,
		param4: number,
		param5: number,
		param6: number,
		param7: number
	): void {
		const _loc8_ = -1;
		let _loc9_ = param3;
		let _loc10_ = param4;
		let _loc11_ = param5;
		let _loc12_ = param6;
		let _loc13_ = param7;
		if (param7 < 0) {
			_loc9_ = param5;
			_loc10_ = param6;
			_loc11_ = param3;
			_loc12_ = param4;
			_loc13_ = -param7;
		}
		let _loc14_ = Math.atan2(_loc10_ - param2, _loc9_ - param1);
		let _loc15_ = Math.atan2(_loc12_ - param2, _loc11_ - param1);
		let _loc16_ = Math.abs(_loc15_ - _loc14_);
		if (Math.PI < _loc16_) {
			_loc16_ = 2 * Math.PI - _loc16_;
		}
		const _loc17_ = Math.floor(_loc16_ / (Math.PI / 4)) + 1;
		const _loc18_ = (_loc8_ * _loc16_) / (2 * _loc17_);
		const _loc19_ = _loc13_ / Math.cos(_loc18_);
		this.ctx.beginPath();
		this.ctx.moveTo(
			(param1 + Math.cos(_loc14_) * _loc13_) * this.scale,
			(param2 + Math.sin(_loc14_) * _loc13_) * this.scale
		);
		let _loc20_ = 0;
		while (_loc20_ < _loc17_) {
			_loc14_ = (_loc15_ = _loc14_ + _loc18_) + _loc18_;
			this.ctx.quadraticCurveTo(
				(param1 + Math.cos(_loc15_) * _loc19_) * this.scale,
				(param2 + Math.sin(_loc15_) * _loc19_) * this.scale,
				(param1 + Math.cos(_loc14_) * _loc13_) * this.scale,
				(param2 + Math.sin(_loc14_) * _loc13_) * this.scale
			);
			_loc20_++;
		}
		this.ctx.stroke();
	}
}
