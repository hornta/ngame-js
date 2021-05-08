import React, { useEffect, useRef, useState } from "react";

const getInitialScale = () => {
	const persisted = localStorage.getItem("scale");
	if (!persisted) {
		1 / 20;
	}
	return Number(persisted);
};

export const Utils = () => {
	const [path, setPath] = useState(localStorage.getItem("pathdata") ?? "");
	const [scale, setScale] = useState(getInitialScale());
	const [data, setData] = useState([]);
	const [windowSize, setWindowSize] = useState([
		window.innerWidth,
		window.innerHeight,
	]);

	const textElement = useRef();
	const canvasElement = useRef<HTMLCanvasElement>();
	const ctx = useRef<CanvasRenderingContext2D>();

	useEffect(() => {
		localStorage.setItem("scale", scale);
	}, [scale]);

	useEffect(() => {
		localStorage.setItem("pathdata", path);
	}, [path]);

	useEffect(() => {
		if (path.length > 0) {
			const lines = [];
			const parts = path.trim().split(" ");
			for (let i = 0; i < parts.length; ++i) {
				const n = Number(parts[i]);
				if (!Number.isNaN(n)) {
					parts[i] = Number((scale * n).toFixed(4));
				}
			}

			// to make everything into strings again in the array
			const parts2 = parts.join(" ").split(" ");

			const data = [];

			lines.push("this.ctx.beginPath();");
			for (let i = 0; i < parts2.length; ++i) {
				switch (parts2[i]) {
					case "M":
						lines.push(`this.ctx.moveTo(${parts2[i + 1]}, ${parts2[i + 2]});`);
						data.push({
							type: "M",
							point: [parts2[i + 1], parts2[i + 2]],
						});
						break;
					case "L":
						{
							let currentPair = 1;
							const points = [];
							while (true) {
								const next1 = parts2[i + currentPair * 2 + 1];
								if (Number.isNaN(Number(next1))) {
									break;
								}
								const next2 = parts2[i + currentPair * 2 + 2];

								lines.push(`this.ctx.lineTo(${next1}, ${next2});`);
								points.push([next1, next2]);
								currentPair += 1;
							}

							data.push({
								type: "L",
								points: points,
							});
						}
						break;
					case "Z":
					case "z":
						lines.push("this.ctx.closePath();");
						data.push({
							type: "Z",
						});
						break;
					default:
				}
			}

			textElement.current.textContent = `${parts.join(" ")}\n${lines.join(
				"\n"
			)}`;
			setData(data);
		}
	}, [path, scale]);

	useEffect(() => {
		if (data && ctx.current) {
			console.log(`render ${windowSize[0]} ${windowSize[1]}`);
			ctx.current.clearRect(0, 0, windowSize[0], windowSize[1]);
			ctx.current.strokeStyle = "black";
			ctx.current.fillStyle = "transparent";

			ctx.current.save();
			ctx.current.translate(windowSize[0] / 2, windowSize[1] / 2);
			ctx.current.beginPath();
			for (const d of data) {
				if (d.type === "M") {
					ctx.current.moveTo(d.point[0], d.point[1]);
				} else if (d.type === "L") {
					for (const p of d.points) {
						ctx.current.lineTo(p[0], p[1]);
					}
				} else if (d.type === "Z") {
					ctx.current.closePath();
				}
			}
			ctx.current.stroke();

			for (const d of data) {
				if (d.type === "M") {
					ctx.current.fillStyle = "red";
					ctx.current.beginPath();
					ctx.current.arc(d.point[0], d.point[1], 5, 0, 2 * Math.PI);
					ctx.current.fill();
				} else if (d.type === "L") {
					for (const p of d.points) {
						ctx.current.fillStyle = "green";
						ctx.current.beginPath();
						ctx.current.arc(p[0], p[1], 5, 0, 2 * Math.PI);
						ctx.current.fill();
					}
				} else if (d.type === "Z") {
					// ctx.current.closePath();
				}
			}

			ctx.current.restore();
		}
	}, [data, windowSize]);

	useEffect(() => {
		const handleResize = () => {
			canvasElement.current.width = window.innerWidth;
			canvasElement.current.height = window.innerHeight;
			setWindowSize([window.innerWidth, window.innerHeight]);
		};

		handleResize();

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [setWindowSize]);

	useEffect(() => {
		if (!ctx.current) {
			ctx.current = canvasElement.current.getContext("2d");
		}
	}, []);

	return (
		<form>
			<input
				value={scale}
				type="number"
				onChange={(e) => {
					setScale(Number(e.target.value));
				}}
			/>
			<br />
			<textarea
				value={path}
				onChange={(e) => {
					setPath(e.target.value);
				}}
			></textarea>
			<pre ref={textElement}></pre>
			<canvas
				ref={canvasElement}
				style={{
					display: "block",
					position: "absolute",
					top: 0,
					right: 0,
					left: 0,
					bottom: 0,
					zIndex: -1,
				}}
			></canvas>
		</form>
	);
};
