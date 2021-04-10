import { Buffer } from "buffer";
import { Inflate } from "pako";
import React, { useEffect } from "react";
import { Route, useParams } from "react-router";
import { ByteArray } from "./byte-array";
import { EditorState } from "./editor-state";
import { prepareSessionFromBytes } from "./fns";
import { PlayerKey, PlayerKeys, soloKeys } from "./player-keys";
import { loadLevelFromEditorState } from "./simulation/simulation-loader";

// const bucketUrl = 'http://bucket.thewayoftheninja.org';
// const levelUrl = `${bucketUrl}/411787.txt`;

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
			const ba = new ByteArray(buffer);
			const levelName = ba.readUTF();
			const rest = ba.newFromAvailable();

			const editorState = EditorState.loadFromBytes(rest);
			const playerActions = soloKeys.getActions([
				PlayerKey.JUMP,
				PlayerKey.LEFT,
				PlayerKey.RIGHT,
			]);
			loadLevelFromEditorState(playerActions, [0x000, 0x000], 1, editorState);
		};

		void makeEditorState();
	}, [levelId]);

	return null;
};

export const App = (): JSX.Element => {
	return <Route path="/level/:levelId" component={Level} />;
};
