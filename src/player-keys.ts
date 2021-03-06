const NUMBER_OF_PLAYER_KEYS = 4;
const MAX_NUMBER_OF_PLAYERS = 2;

export enum PlayerKey {
	JUMP = 0,
	LEFT = 1,
	RIGHT = 2,
	SUICIDE = 3,
}

export class PlayerKeys {
	playerBindings: string[];

	constructor() {
		this.playerBindings = new Array<string>(
			NUMBER_OF_PLAYER_KEYS * MAX_NUMBER_OF_PLAYERS
		);
	}

	bindActionKeyForPlayer(
		playerKey: PlayerKey,
		key: string,
		playerId: number
	): void {
		this.playerBindings[playerId * NUMBER_OF_PLAYER_KEYS + playerKey] = key;
	}

	getActionKeyForPlayer(key: number, playerId: number): string {
		return this.playerBindings[playerId * NUMBER_OF_PLAYER_KEYS + key];
	}

	getActions(keys: number[]): string[] {
		const actionKeys: string[] = [];
		for (let playerId = 0; playerId < MAX_NUMBER_OF_PLAYERS; ++playerId) {
			for (let i = 0; i < keys.length; ++i) {
				actionKeys.push(this.getActionKeyForPlayer(keys[i], playerId));
			}
		}
		return actionKeys;
	}
}

export const soloKeys = new PlayerKeys();
soloKeys.bindActionKeyForPlayer(PlayerKey.JUMP, "KeyZ", 0);
soloKeys.bindActionKeyForPlayer(PlayerKey.LEFT, "ArrowLeft", 0);
soloKeys.bindActionKeyForPlayer(PlayerKey.RIGHT, "ArrowRight", 0);
soloKeys.bindActionKeyForPlayer(PlayerKey.SUICIDE, "KeyK", 0);

export const coopKeys = new PlayerKeys();
coopKeys.bindActionKeyForPlayer(PlayerKey.JUMP, "Shift", 0);
coopKeys.bindActionKeyForPlayer(PlayerKey.LEFT, "a", 0);
coopKeys.bindActionKeyForPlayer(PlayerKey.RIGHT, "d", 0);
coopKeys.bindActionKeyForPlayer(PlayerKey.SUICIDE, "t", 0);
coopKeys.bindActionKeyForPlayer(PlayerKey.JUMP, "n", 0);
coopKeys.bindActionKeyForPlayer(PlayerKey.LEFT, ",", 0);
coopKeys.bindActionKeyForPlayer(PlayerKey.RIGHT, ".", 0);
coopKeys.bindActionKeyForPlayer(PlayerKey.SUICIDE, "o", 0);
