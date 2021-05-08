import { Buffer } from "buffer";
import { Inflate } from "pako";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Route, useParams } from "react-router";
import { ByteArray } from "./byte-array";
import { requestHighscores } from "./fns.js";
import { Game } from "./game";
import { getLevelByID } from "./level-sets.js";
import { Simulator } from "./simulation/simulator.js";
import { Utils } from "./utils.jsx";

// const bucketUrl = 'http://bucket.thewayoftheninja.org';
// const levelUrl = `${bucketUrl}/411787.txt`;

const game = new Game();

const preferredRatio = Simulator.GRID_NUM_COLUMNS / Simulator.GRID_NUM_ROWS;

function readIntOfLength(param1: ByteArray, param2: number): number {
	let _loc3_ = 0;
	let _loc5_ = param2 - 1;
	while (_loc5_ >= 0) {
		const _loc4_ = param1.readUnsignedByte();
		_loc3_ += _loc4_ << (_loc5_ * 8);
		_loc5_--;
	}
	return _loc3_;
}

function readTextToDelimiter(param1: ByteArray): string {
	let _loc3_ = 0;
	let _loc2_ = "";
	do {
		_loc3_ = param1.readUnsignedByte();
		if (_loc3_ > 31) {
			_loc2_ += String.fromCharCode(_loc3_);
		}
	} while (_loc3_ > 31);

	--param1.position;
	return _loc2_;
}

const highscores = async (): void => {
	const buffer = await requestHighscores(levelId);
	const byteArray = new ByteArray(buffer);
	byteArray.position = 0;
	while (byteArray.position < byteArray.length - 1) {
		const _loc2_ = readIntOfLength(byteArray, 3);
		const _loc3_ = readIntOfLength(byteArray, 4);
		const _loc4_ = readTextToDelimiter(byteArray);
		console.log(`Time: ${_loc2_}, User: ${_loc4_}, ${_loc3_}`);
		// var _loc5_: HighscoreDisplay;
		// (_loc5_ = this._displays[this._nextScoreIndex]).user.text = _loc4_;
		// _loc5_.time.text = String(_loc2_);
		// _loc5_.visible = true;
		// this._users[this._nextScoreIndex] = _loc3_;
		// this._scores[this._nextScoreIndex] = _loc2_;
	}
	return 1;
};

const fetchHighscores = (): void => {
	highscores();
};

const Level = () => {
	const { levelId } = useParams<{ levelId: string }>();
	const [canvas, setCanvas] = useState<HTMLCanvasElement>();

	const getGameSize = useCallback((): [number, number] => {
		let newWidth = window.innerWidth;
		let newHeight = window.innerHeight;
		const newWidthToHeight = newWidth / newHeight;
		if (newWidthToHeight > preferredRatio) {
			// window width is too wide relative to desired game width
			newWidth = newHeight * preferredRatio;
		} else {
			// window height is too high relative to desired game height
			newHeight = newWidth / preferredRatio;
		}

		return [newWidth, newHeight];
	}, [canvas]);

	const actualGameSize = useRef<{ width: number; height: number }>(
		getGameSize()
	);

	const setRef = (node) => {
		if (node) {
			setCanvas(node);
		}
	};

	useEffect(() => {
		if (canvas) {
			game.setCanvas(canvas);
			game.setCanvasSize(actualGameSize.current[0], actualGameSize.current[1]);
		}
	}, [canvas]);

	useEffect(() => {
		const handleResize = () => {
			const [width, height] = getGameSize();
			if (width !== canvas.width || height !== canvas.height) {
				game.setCanvasSize(width, height);
			}
		};
		if (canvas) {
			window.addEventListener("resize", handleResize, false);

			handleResize();
		}
		return () => {
			window.removeEventListener("resize", handleResize, false);
		};
	}, [canvas]);

	useEffect(() => {
		const makeEditorState = async () => {
			const numLevelId = Number(levelId);
			if (numLevelId < 1000) {
				const data = getLevelByID(numLevelId);
				game.playSingleLevelFromBytes(data, numLevelId);
			} else {
				const response = await fetch(
					`http://bucket.thewayoftheninja.org/${numLevelId}.txt`
				);
				const base64 = await response.text();
				const decoded = Buffer.from(base64, "base64");
				const inflator = new Inflate();
				inflator.push(decoded);
				if (inflator.err) {
					console.log(inflator.msg);
				}
				const buffer = Buffer.from(inflator.result);
				const levelData = new ByteArray(buffer);
				game.playSingleLevelFromBytes(levelData, numLevelId);
			}
		};

		fetchHighscores();

		void makeEditorState();
	}, [levelId]);

	return (
		<canvas
			style={{
				display: "block",
				margin: "0 auto",
			}}
			ref={setRef}
		></canvas>
	);
};

export const App = (): JSX.Element => {
	return (
		<>
			<Route path="/level/:levelId" component={Level} />
			<Route path="/utils" component={Utils} />
		</>
	);
};
