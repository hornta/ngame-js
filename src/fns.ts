import type { ByteArray } from "./byte-array";
import type { GridSegment } from "./simulation/grid-segment";
import type { Ninja } from "./simulation/ninja";
import type { Vector2 } from "./simulation/vector2";

export const prepareSessionFromBytes = (byteArray: ByteArray): void => {};

// export const searchLevels = ({ name }) => {
//   const params = new Map();
//   params.set('search[level_name]', )
//   const path = SERVER_URL + '/search.php';
//   http://nserver.thewayoftheninja.org/search.php?search[level_name]=&search[username]=&search[user_id]=&search[playername]=&search[player_id]=&search[min_date]=&search[max_date]=&search[genre]=&search[min_rating]=&search[max_rating]=&sort=username&row_count=10&offset=0
// }

export const overlapCircleVsCircle = (
	centerA: Vector2,
	radiusA: number,
	centerB: Vector2,
	radiusB: number
): boolean => {
	const xDiff: number = centerB.x - centerA.x;
	const yDiff: number = centerB.y - centerA.y;
	const diffSquared: number = xDiff * xDiff + yDiff * yDiff;
	const sumRadius: number = radiusA + radiusB;
	if (diffSquared < sumRadius * sumRadius) {
		return true;
	}
	return false;
};

export const wrapAngleShortest = (radians: number): number => {
	while (Math.PI < Math.abs(radians)) {
		if (radians < 0) {
			radians += 2 * Math.PI;
		} else {
			radians -= 2 * Math.PI;
		}
	}
	return radians;
};

export const wrapAnglePosition = (radians: number): number => {
	while (radians < 0 || radians > Math.PI * 2) {
		if (radians < 0) {
			radians += 2 * Math.PI;
		} else if (2 * Math.PI < radians) {
			radians -= 2 * Math.PI;
		}
	}
	return radians;
};

export const tryToAcquireTarget = (
	position: Vector2,
	ninjas: Ninja[],
	segmentGrid: GridSegment
): number => {
	const potentialList = [];
	for (let playerIndex = 0; playerIndex < ninjas.length; ++playerIndex) {
		const ninja = ninjas[playerIndex];
		if (!ninja.isDead()) {
			if (
				segmentGrid.raycastVsPlayer(
					position,
					ninja.getPosition(),
					ninja.getRadius(),
					new Vector2(0, 0),
					new Vector2(0, 0)
				)
			) {
				potentialList.push(playerIndex);
			}
		}
	}

	if (potentialList.length > 0) {
		let consideredPlayerIndex = 0;
		const _loc6_ = ninjas[potentialList[0]].getPosition().x - position.x;
		const _loc7_ = ninjas[potentialList[0]].getPosition().y - position.y;
		const closestDistanceSquared = _loc6_ * _loc6_ + _loc7_ * _loc7_;
		for (
			let playerIndex = 1;
			playerIndex < potentialList.length;
			++playerIndex
		) {
			const diffX =
				ninjas[potentialList[playerIndex]].getPosition().x - position.x;
			const diffY =
				ninjas[potentialList[playerIndex]].getPosition().y - position.y;
			const distanceSquared = diffX * diffX + diffY * diffY;
			if (distanceSquared < closestDistanceSquared) {
				consideredPlayerIndex = playerIndex;
			}
		}

		return potentialList[consideredPlayerIndex];
	}
	return -1;
};
