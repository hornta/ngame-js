import { Ticker } from "@pixi/ticker";
import type { ByteArray } from "./byte-array";
import { EditorState } from "./editor-state";
import { GameState } from "./game-state.js";
import { GraphicsManager } from "./graphics-manager.js";
import { Input } from "./input";
import { MenuState } from "./menu-state.js";
import { Options } from "./options";
import { coopKeys, PlayerKey, PlayerKeys, soloKeys } from "./player-keys";
import { loadLevelFromEditorState } from "./simulation/simulation-loader";
import {
	SimulationRate as SIMULATION_RATE,
	Simulator,
} from "./simulation/simulator";

const DEFAULT_STARTING_TICKS = 90 * SIMULATION_RATE;
const TICKS_PER_GOLD = 2 * SIMULATION_RATE;
const GOLD_DELAY = 8;
const SLOW_THRESHOLD = 0.15;
const POSTGAME_DELAY = 30;

export class Game {
	input = new Input();
	simulator: Simulator;
	gameState = GameState.UNLOADED;
	menuState = MenuState.MAIN_MENU;
	gameOverCooldown = 0;
	startingTicks = 0;
	currentTicks = 0;
	ticksElapsed = 0;
	lastTick = 0;
	thisTick = 0;
	levelData: ByteArray;
	levelName = "";
	levelId = 0;
	goldCollected = 0;
	goldCountdown = 0;
	isReplay = false;
	replayChosenByPlayer = false;
	playingLevelSet = false;
	playerKeys: PlayerKeys;
	start = 0;
	pausedTime = 0;
	gameTooSlow = false;
	ticker: Ticker;
	private canvas: HTMLCanvasElement;
	private gfx: GraphicsManager;
	private renderId: number;
	private boundRender: () => void;

	constructor() {
		this.ticker = new Ticker();
		this.ticker.add(() => {
			this.tick();
		});
		this.ticker.start();

		this.gfx = new GraphicsManager();

		this.boundRender = this.render.bind(this);
	}

	private startRender(): void {
		this.renderId = requestAnimationFrame(this.boundRender);
	}

	private stopRender(): void {
		cancelAnimationFrame(this.renderId);
	}

	private render(): void {
		this.gfx.render();
		if (this.simulator) {
			this.simulator.segGrid.debugDraw(this.gfx.getContext());
		}
		this.renderId = requestAnimationFrame(this.boundRender);
	}

	public setCanvas(element: HTMLCanvasElement): void {
		this.canvas = element;
		this.gfx.setContext(
			this.canvas.getContext("2d", {
				alpha: false,
			})
		);
		this.gfx.setWidthAndHeight(element.width, element.height);
	}

	public setCanvasSize(width: number, height: number): void {
		this.canvas.width = width;
		this.canvas.height = height;
		this.gfx.setWidthAndHeight(width, height);
	}

	initialize(): void {
		this.startingTicks = DEFAULT_STARTING_TICKS;
		this.gameOverCooldown = 0;
		this.menuState = MenuState.MAIN_MENU;
		this.gameState = GameState.UNLOADED;
	}

	tick(): void {
		this.thisTick = Date.now();
		this.input.tick();
		// this.debugRenderer.Clear();
		switch (this.menuState) {
			case MenuState.PLAYING_GAME:
				this.tickGame();
				break;
			case MenuState.GAME_OVER:
				this.tickGameOver();
				break;
			case MenuState.WATCHING_REPLAY:
				this.tickReplay();
				break;
			default:
		}
		this.lastTick = this.thisTick;
	}

	tickGame(): void {
		switch (this.gameState) {
			case GameState.PRE_GAME:
				this.tickPreGame();
				break;
			case GameState.GAME:
				this.tickGameInProgress();
				break;
			case GameState.POST_GAME:
				this.tickPostGame();
				break;
			case GameState.PAUSED_IN_GAME:
				this.tickPausedGame();
				break;
			default:
		}
	}

	private tickPreGame(): void {
		if (this.playerReadyToProceed()) {
			this.startGameImmediately();
		} else if (this.playerWantsToExit()) {
			this.exit();
		}
	}

	private tickGameInProgress(): void {
		this.checkForSuicides();
		if (this.playerWantsToPause()) {
			this.gameState = GameState.PAUSED_IN_GAME;
			return;
		}
		this.tickSimulator();
		if (this.simulator.isGameDone()) {
			this.triggerGameEnd();
		}
	}

	private tickPostGame(): void {
		// this.updateInGameDisplay();
		this.tickSimulator();
		this.gameOverCooldown = Math.max(0, this.gameOverCooldown - 1);
		if (this.gameOverCooldown > 0) {
			return;
		}
		if (this.playerReadyToProceed()) {
			// this.showHUD();
			this.continueGame();
		} else if (this.playerWantsToExit()) {
			this.exit();
		}
		if (this.goldCollected > 0 && this.simulator.didPlayerWin()) {
			this.tickGoldTransferToTimebar();
		}
	}

	private tickPausedGame(): void {
		const playerKeys = this.playerKeys.getActions([
			PlayerKey.JUMP,
			PlayerKey.LEFT,
			PlayerKey.RIGHT,
		]);
		playerKeys[playerKeys.length] = "KeyP";
		if (this.input.isKeyPressed("Escape")) {
			this.exit();
		} else if (this.input.isOnePressed(playerKeys)) {
			this.gameState = GameState.GAME;
		}
		this.pausedTime += Date.now() - this.lastTick;
	}

	private tickGameOver(): void {
		if (this.playerReadyToProceed()) {
			this.exit();
		}
	}

	private tickReplay(): void {
		switch (this.gameState) {
			case GameState.GAME:
				this.tickReplayInProgress();
				break;
			case GameState.POST_GAME:
				this.tickReplayPostGame();
				break;
			default:
		}
	}

	private tickReplayInProgress(): void {
		if (this.replayChosenByPlayer) {
			//  this.updateInGameDisplay();
		}
		if (this.input.isKeyPressed("Escape") && this.replayChosenByPlayer) {
			//  this.exitReplay();
		} else {
			//  this.continueReplay();
		}
	}

	private tickReplayPostGame(): void {
		this.tickSimulator();
		this.gameOverCooldown = Math.max(0, this.gameOverCooldown - 1);
		if (this.gameOverCooldown > 0) {
			return;
		}
		// this.endReplay();
	}

	private tickSimulator(): void {
		this.simulator.tick();

		if (!this.simulator.isGameDone()) {
			--this.currentTicks;
			++this.ticksElapsed;
			if (this.currentTicks <= 0) {
				this.currentTicks = 0;
				this.simulator.timeIsUp();
			} else {
				this.currentTicks +=
					this.simulator.getNumGoldCollectedDuringTick(0) * TICKS_PER_GOLD;
				if (Options.coopMode && !this.isReplay) {
					this.currentTicks +=
						this.simulator.getNumGoldCollectedDuringTick(1) * TICKS_PER_GOLD;
				}
			}
		}
	}

	public playSingleLevelFromBytes(levelData: ByteArray, levelId: number): void {
		this.playLevel(levelData);
		this.levelId = levelId;
		this.startingTicks = DEFAULT_STARTING_TICKS;
		this.currentTicks = this.startingTicks;
		this.ticksElapsed = 0;
		this.playingLevelSet = false;
	}

	private playLevel(levelData: ByteArray): void {
		this.levelData = levelData;
		this.isReplay = false;
		this.prepareSessionFromBytes(this.levelData, null);
		this.goldCollected = 0;
		this.menuState = MenuState.PLAYING_GAME;
		this.gameState = GameState.PRE_GAME;
	}

	private prepareSessionFromBytes(
		levelData: ByteArray,
		replayInput: ByteArray | null
	): void {
		this.clearGame();
		const inputData = replayInput ? replayInput.newFromAvailable() : null;
		this.levelName = levelData.readUTF();
		const editorState = EditorState.loadFromBytes(levelData.newFromAvailable());

		let numberOfPlayers = 0;
		if (Options.coopMode && !this.replayChosenByPlayer) {
			numberOfPlayers = 2;
			this.playerKeys = coopKeys;
		} else {
			numberOfPlayers = 1;
			this.playerKeys = soloKeys;
		}
		const playerActions = this.playerKeys.getActions([
			PlayerKey.JUMP,
			PlayerKey.LEFT,
			PlayerKey.RIGHT,
		]);
		this.simulator = loadLevelFromEditorState(
			playerActions,
			[0x000, 0x000],
			this.input,
			inputData,
			numberOfPlayers,
			editorState
		);
		this.simulator.enablePlayer(0);
		if (Options.coopMode && !this.replayChosenByPlayer) {
			this.simulator.enablePlayer(1);
		}

		this.gfx.setData(
			this.simulator.entityList,
			this.simulator.playerList,
			this.simulator.tileIDs,
			Simulator.GRID_NUM_ROWS,
			Simulator.GRID_NUM_COLUMNS
		);
		this.startRender();
	}

	clearGame(): void {
		this.stopRender();
	}

	private exit(): void {
		this.clearGame();
		this.menuState = MenuState.MAIN_MENU;
	}

	private playerReadyToProceed(): boolean {
		if (
			this.input.isKeyPressed(
				this.playerKeys.getActionKeyForPlayer(PlayerKey.JUMP, 0)
			)
		) {
			return true;
		}
		if (this.input.isKeyPressed("Space")) {
			return true;
		}
		return false;
	}

	private playerWantsToExit(): boolean {
		return this.input.isKeyPressed("Escape");
	}

	private playerWantsToPause(): boolean {
		if (this.input.isKeyPressed("Escape")) {
			return true;
		}
		if (this.input.isKeyPressed("KeyP")) {
			return true;
		}
		return false;
	}

	private checkForSuicides(): void {
		for (let i = 0; i < (Options.coopMode ? 2 : 1); ++i) {
			this.checkForPlayerSuicide(i);
		}
	}

	private checkForPlayerSuicide(playerIndex: number): void {
		if (!this.simulator.isPlayerDead(playerIndex)) {
			if (
				this.input.isKeyPressed(
					this.playerKeys.getActionKeyForPlayer(PlayerKey.SUICIDE, playerIndex)
				)
			) {
				this.simulator.suicidePlayer(playerIndex);
			}
		}
	}

	private startGameImmediately(): void {
		this.gameState = GameState.GAME;
		this.start = Date.now();
		this.pausedTime = 0;
	}

	private triggerGameEnd(): void {
		const _loc1_ = Date.now();
		const _loc2_ = _loc1_ - this.start - this.pausedTime;
		const _loc3_ = _loc2_ / 17;
		const _loc4_ = _loc3_ - this.ticksElapsed;
		this.gameTooSlow = _loc4_ / _loc3_ > SLOW_THRESHOLD;
		this.gameState = GameState.POST_GAME;
		this.gameOverCooldown = POSTGAME_DELAY;
		// this._hud.prompt.visible = true;
		if (this.playingLevelSet) {
			if (this.simulator.didPlayerWin()) {
				// this._hud.prompt.gotoAndPlay("win");
			} else {
				// this._hud.prompt.gotoAndPlay("lose");
			}
		} else {
			// this.storeGameStats();
			// this.showLevelResultDialog();
		}
	}

	private continueGame(): void {
		if (this.simulator.didPlayerWin()) {
			this.instantlyTransferRemainingGoldToTimebar();
		}
		/*	if (this.playingLevelset) {
			if (this.simulator.didPlayerWin())) {
				this.advanceToNextLevel();
			} else if (this._currentTicks <= 0) {
				this.gameOverTimeUp();
			} else {
				if (this.options.resetScoreOnDeath) {
					this._currentTicks = this._startingTicks;
					this._ticksElapsed = 0;
				}
				this._goldCollected = 0;
				this.prepareSessionFromBytes(this._levelData, null);
			}
		} else*/
		if (this.playerReadyToProceed()) {
			this.currentTicks = this.startingTicks;
			this.ticksElapsed = 0;
			this.prepareSessionFromBytes(this.levelData, null);
		} else {
			this.exit();
		}
		this.gameState = GameState.PRE_GAME;
	}

	private instantlyTransferRemainingGoldToTimebar(): void {
		this.currentTicks += this.goldCollected * TICKS_PER_GOLD;
		this.goldCollected = 0;
	}

	private tickGoldTransferToTimebar(): void {
		--this.goldCountdown;
		if (this.goldCountdown <= 0) {
			this.transferOneUnitOfGoldToTimebar();
		}
	}

	private transferOneUnitOfGoldToTimebar(): void {
		--this.goldCollected;
		this.currentTicks += TICKS_PER_GOLD;
		this.goldCountdown = GOLD_DELAY;
	}
}
