import type { ByteArray } from "./byte-array";
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
