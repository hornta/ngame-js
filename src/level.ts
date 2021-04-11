import type { ByteArray } from "./byte-array";

export class Level {
	id: number;
	name: string;
	creatorId: string;
	creatorName: string;
	meanRating: number;
	isLoaded: boolean;
	personalBest: number;
	minimumHighscore: number;
	favourite: number;
	data: ByteArray;
	isNew: boolean;
	published: boolean;
	personalRating: number;
	fullData: boolean;
	waitingForUpload: boolean;

	constructor() {
		this.name = "Untitled";
		this.isNew = false;
		this.fullData = false;
	}

	public isMetanetLevel(): boolean {
		return this.id < 1000;
	}
}
