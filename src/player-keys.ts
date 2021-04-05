const NUMBER_OF_PLAYER_KEYS = 4;
const MAX_NUMBER_OF_PLAYERS = 2;

export enum PlayerKey {
	JUMP = 0,
	LEFT = 1,
	RIGHT = 2,
	SUICIDE = 3,
}

export const soloKeys = new PlayerKeys();
soloKeys.bindActionKeyForPlayer(PlayerKey.JUMP, "z", 0);
soloKeys.bindActionKeyForPlayer(PlayerKey.LEFT, "ArrowLeft", 0);
soloKeys.bindActionKeyForPlayer(PlayerKey.RIGHT, "ArrowRight", 0);
soloKeys.bindActionKeyForPlayer(PlayerKey.SUICIDE, "k", 0);

export const coopKeys = new PlayerKeys();
coopKeys.bindActionKeyForPlayer(PlayerKey.JUMP, "Shift", 0);
coopKeys.bindActionKeyForPlayer(PlayerKey.LEFT, "a", 0);
coopKeys.bindActionKeyForPlayer(PlayerKey.RIGHT, "d", 0);
coopKeys.bindActionKeyForPlayer(PlayerKey.SUICIDE, "t", 0);
coopKeys.bindActionKeyForPlayer(PlayerKey.JUMP, "n", 0);
coopKeys.bindActionKeyForPlayer(PlayerKey.LEFT, ",", 0);
coopKeys.bindActionKeyForPlayer(PlayerKey.RIGHT, ".", 0);
coopKeys.bindActionKeyForPlayer(PlayerKey.SUICIDE, "o", 0);

export class PlayerKeys {
	playerBindings: number[];

	constructor() {
		this.playerBindings = new Array<number[]>(
			NUMBER_OF_PLAYER_KEYS * MAX_NUMBER_OF_PLAYERS
		);
	}

	bindActionKeyForPlayer(key: number, key: string, playerId: number): void {
		this.playerBindings[playerId * NUMBER_OF_PLAYER_KEYS + key] = key;
	}

	getActionKeyForPlayer(key: number, playerId: number): number {
		return this.playerBindings[playerId * NUMBER_OF_PLAYER_KEYS + key];
	}

	getActions(keys: number[]): number[] {
		const actionKeys: number[] = [];
		for (let playerId = 0; playerId < MAX_NUMBER_OF_PLAYERS; ++playerId) {
			for (let i = 0; i < keys.length; ++i) {
				actionKeys.push(this.getActionKeyForPlayer(keys[i], playerId));
			}
		}
		return actionKeys;
	}
}
