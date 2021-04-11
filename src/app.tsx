import { Buffer } from "buffer";
import { Inflate } from "pako";
import React, { useEffect } from "react";
import { Route, useParams } from "react-router";
import { ByteArray } from "./byte-array";
import { Controller } from "./controller";

// const bucketUrl = 'http://bucket.thewayoftheninja.org';
// const levelUrl = `${bucketUrl}/411787.txt`;

const controller = new Controller();

const Level = () => {
	const { levelId } = useParams<{ levelId: string }>();

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
			controller.game.playSingleLevelFromBytes(levelData, Number(levelId));
		};

		void makeEditorState();
	}, [levelId]);

	return <canvas></canvas>;
};

export const App = (): JSX.Element => {
	return (
		<>
			<Route path="/level/:levelId" component={Level} />
			123
		</>
	);
};
