import type { ByteArray } from "./byte-array";
import { EditorState } from "./editor-state";
import type { GameState } from "./game-state";
import { Input } from "./input";
import type { MenuState } from "./menu-state";
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

export class App {
	input: Input;
	simulator: Simulator;
	gameState: GameState;
	menuState: MenuState;
	gameOverCooldown: number;
	startingTicks: number;
	currentTicks: number;
	ticksElapsed: number;
	levelData: ByteArray;
	levelName: string;
	levelId: number;
	goldCollected: number;
	isReplay: boolean;
	replayChosenByPlayer: boolean;
	playingLevelSet: boolean;
	playerKeys: PlayerKeys;
	start: number;
	pausedTime: number;

	constructor() {
		this.input = new Input();
		this.replayChosenByPlayer = false;
	}

	initialize() {
		this.startingTicks = DEFAULT_STARTING_TICKS;
		this.gameOverCooldown = 0;
		this.menuState = MenuState.MAIN_MENU;
		this.gameState = GameState.UNLOADED;
	}

	tick(): void {
		this.input.tick();
		// this.debugRenderer.Clear();
		switch (this.menuState) {
			case MenuState.PLAYING_GAME:
				this.tickGame();
				break;
			case MenuStates.GAME_OVER:
				this.tickGameOver();
				break;
			case MenuStates.WATCHING_REPLAY:
				this.tickReplay();
				break;
			default:
		}
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
		if (this.finished) {
			this.triggerGameEnd();
		}
	}

	private tickPostGame(): void {}

	private tickPausedGame(): void {}

	private tickGameOver(): void {
		if (this.playerReadyToProceed()) {
			this.exit();
		}
	}

	tickReplay(): void {}

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
				if (Options.coopMode && !this._isReplay) {
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
		replayInput: ByteArray
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
	}

	clearGame(): void {
		this.simulator = null;
	}

	transferOneUnitOfGoldToTimebar(): void {
		--this._goldCollected;
		this._currentTicks += this._ticksPerGold;
		this._goldCountdown = this.GOLD_DELAY;
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
		for (let i = 0; i < Options.coopMode ? 2 : 1; ++i) {
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

	private didPlayerWin(): boolean {
		return this.simulator.didPlayerWin();
	}

	private startGameImmediately(): void {
		this.gameState = GameState.GAME;
		this.start = Date.now();
		this.pausedTime = 0;
	}
}
