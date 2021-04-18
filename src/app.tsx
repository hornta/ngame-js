import { Buffer } from "buffer";
import { Inflate } from "pako";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Route, useParams } from "react-router";
import { ByteArray } from "./byte-array";
import { Game } from "./game";
import { Simulator } from "./simulation/simulator.js";

// const bucketUrl = 'http://bucket.thewayoftheninja.org';
// const levelUrl = `${bucketUrl}/411787.txt`;

const game = new Game();

const preferredRatio = Simulator.GRID_NUM_COLUMNS / Simulator.GRID_NUM_ROWS;

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
			const response = await fetch(
				`http://bucket.thewayoftheninja.org/${levelId}.txt`
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
			game.playSingleLevelFromBytes(levelData, Number(levelId));
		};

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
		</>
	);
};
