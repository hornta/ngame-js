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
	data: ByteArray | null;
	isNew: boolean;
	published: boolean;
	personalRating: number;
	fullData: boolean;
	waitingForUpload: boolean;

	constructor() {
		this.id = 0;
		this.name = "Untitled";
		this.creatorId = "unknown";
		this.creatorName = "Unknown";
		this.meanRating = 0;
		this.isLoaded = false;
		this.personalBest = 0;
		this.minimumHighscore = 0;
		this.favourite = 0;
		this.data = null;
		this.isNew = false;
		this.published = false;
		this.personalRating = 0;
		this.fullData = false;
		this.waitingForUpload = false;
	}

	public isMetanetLevel(): boolean {
		return this.id < 1000;
	}
}
