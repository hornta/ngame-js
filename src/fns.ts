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

export const overlapCircleVsSegment = (
	position: Vector2,
	radius: number,
	segStart: Vector2,
	segEnd: Vector2,
	distance: number
): boolean => {
	const _loc6_ = position.x - segStart.x;
	const _loc7_ = position.y - segStart.y;
	const _loc8_ = (segEnd.x - segStart.x) / distance;
	const _loc9_ = (segEnd.y - segStart.y) / distance;
	const _loc10_ = _loc6_ * _loc8_ + _loc7_ * _loc9_;
	const cp = new Vector2();
	if (_loc10_ <= 0) {
		cp.setFrom(segStart);
	} else if (_loc10_ >= distance) {
		cp.setFrom(segEnd);
	} else {
		cp.x = segStart.x + _loc10_ * _loc8_;
		cp.y = segStart.y + _loc10_ * _loc9_;
	}
	const _loc11_ = position.x - cp.x;
	const _loc12_ = position.y - cp.y;
	const _loc13_ = _loc11_ * _loc11_ + _loc12_ * _loc12_;
	if (_loc13_ < radius * radius) {
		return true;
	}
	return false;
};

export const timeOfIntersectionCircleVsCircle = (
	param1: Vector2,
	param2: Vector2,
	param3: Vector2,
	param4: Vector2,
	param5: number
): number => {
	let _loc14_ = NaN;
	let _loc15_ = NaN;
	let _loc16_ = NaN;
	let _loc17_ = NaN;
	const _loc6_ = param2.x - param4.x;
	const _loc7_ = param2.y - param4.y;
	const _loc8_ = param1.x - param3.x;
	const _loc9_ = param1.y - param3.y;
	const _loc10_ = _loc6_ * _loc6_ + _loc7_ * _loc7_;
	const _loc11_ = 2 * (_loc8_ * _loc6_ + _loc9_ * _loc7_);
	const _loc12_ = _loc8_ * _loc8_ + _loc9_ * _loc9_ - param5 * param5;
	const _loc13_ = 0.0001;
	if (_loc12_ <= 0) {
		return -1;
	}
	if (Math.abs(_loc10_) < _loc13_) {
		return 2;
	}
	if (_loc11_ >= 0) {
		return 2;
	}
	if ((_loc14_ = _loc11_ * _loc11_ - 4 * _loc10_ * _loc12_) < 0) {
		return 2;
	}
	_loc16_ = (_loc15_ = -0.5 * (_loc11_ - Math.sqrt(_loc14_))) / _loc10_;
	_loc17_ = _loc12_ / _loc15_;
	return Math.min(_loc16_, _loc17_);
};

export const timeOfIntersectionPointVsLineSegment = (
	param1: Vector2,
	param2: Vector2,
	param3: Vector2,
	param4: Vector2,
	param5: number
): number => {
	let _loc18_ = NaN;
	let _loc19_ = NaN;
	let _loc20_ = NaN;
	let _loc6_ = param4.x - param3.x;
	let _loc7_ = param4.y - param3.y;
	const _loc8_ = Math.sqrt(_loc6_ * _loc6_ + _loc7_ * _loc7_);
	_loc6_ /= _loc8_;
	const _loc9_ = -(_loc7_ /= _loc8_);
	const _loc10_ = _loc6_;
	const _loc11_ = param1.x - param3.x;
	const _loc12_ = param1.y - param3.y;
	const _loc13_ = _loc9_ * _loc11_ + _loc10_ * _loc12_;
	const _loc14_ = _loc9_ * param2.x + _loc10_ * param2.y;
	const _loc15_ = _loc6_ * _loc11_ + _loc7_ * _loc12_;
	let _loc17_;
	let _loc16_;
	if ((_loc17_ = (_loc16_ = Math.abs(_loc13_)) - param5) < 0) {
		if (_loc15_ < 0 || _loc15_ > _loc8_) {
			return 2;
		}
		return -1;
	}
	if (_loc13_ * _loc14_ >= 0) {
		return 2;
	}
	_loc18_ = _loc17_ / Math.abs(_loc14_);
	_loc19_ = _loc6_ * param2.x + _loc7_ * param2.y;
	if ((_loc20_ = _loc15_ + _loc18_ * _loc19_) < 0 || _loc20_ > _loc8_) {
		return 2;
	}
	return _loc18_;
};

export const timeOfIntersectionCircleVsArc = (
	param1: Vector2,
	param2: Vector2,
	param3: Vector2,
	param4: Vector2,
	param5: Vector2,
	param6: number
): number => {
	const _loc7_ = param4.x - param3.x;
	const _loc8_ = param4.y - param3.y;
	const _loc9_ = Math.sqrt(_loc7_ * _loc7_ + _loc8_ * _loc8_);
	const _loc10_ = timeOfIntersectionCircleVsArcHelper(
		param1,
		param2,
		param3,
		param4,
		param5,
		_loc9_ + param6
	);
	const _loc11_ = timeOfIntersectionCircleVsArcHelper(
		param1,
		param2,
		param3,
		param4,
		param5,
		_loc9_ - param6
	);
	return Math.min(_loc10_, _loc11_);
};

const timeOfIntersectionCircleVsArcHelper = (
	param1: Vector2,
	param2: Vector2,
	param3: Vector2,
	param4: Vector2,
	param5: Vector2,
	param6: number
): number => {
	let _loc13_ = NaN;
	let _loc14_ = NaN;
	let _loc15_ = NaN;
	let _loc16_ = NaN;
	let _loc17_ = NaN;
	let _loc18_ = NaN;
	let _loc19_ = NaN;
	let _loc20_ = NaN;
	let _loc21_ = NaN;
	let _loc22_ = NaN;
	let _loc23_ = NaN;
	let _loc24_ = NaN;
	let _loc25_ = NaN;
	let _loc26_ = NaN;
	let _loc27_ = NaN;
	let _loc28_ = NaN;
	let _loc29_ = NaN;
	let _loc30_ = NaN;
	let _loc31_ = NaN;
	let _loc32_ = NaN;
	const _loc7_ = param1.x - param3.x;
	const _loc8_ = param1.y - param3.y;
	const _loc9_ = param2.dot(param2);
	const _loc10_ = 2 * (_loc7_ * param2.x + _loc8_ * param2.y);
	const _loc11_ = _loc7_ * _loc7_ + _loc8_ * _loc8_ - param6 * param6;
	const _loc12_ = 0.0001;
	if (Math.abs(_loc9_) < _loc12_) {
		return 2;
	}
	if ((_loc13_ = _loc10_ * _loc10_ - 4 * _loc9_ * _loc11_) < 0) {
		return 2;
	}
	_loc15_ = (_loc14_ = -0.5 * (_loc10_ - Math.sqrt(_loc13_))) / _loc9_;
	_loc16_ = _loc11_ / _loc14_;
	_loc17_ = param4.x - param3.x;
	_loc18_ = param4.y - param3.y;
	_loc19_ = param5.x - param3.x;
	_loc20_ = param5.y - param3.y;
	_loc21_ = param5.x - param4.x;
	_loc22_ = param5.y - param4.y;
	_loc23_ = _loc21_ * -_loc18_ + _loc22_ * _loc17_;
	_loc24_ = _loc21_ * -_loc20_ + _loc22_ * _loc19_;
	if (_loc15_ < 0) {
		_loc15_ = 2;
	}
	if (_loc16_ < 0) {
		_loc16_ = 2;
	}
	if (_loc15_ <= 1) {
		_loc25_ = param1.x + _loc15_ * param2.x - param3.x;
		_loc26_ = param1.y + _loc15_ * param2.y - param3.y;
		_loc27_ = _loc25_ * -_loc18_ + _loc26_ * _loc17_;
		_loc28_ = _loc25_ * -_loc20_ + _loc26_ * _loc19_;
		if (_loc27_ * _loc23_ <= 0 || _loc28_ * _loc24_ >= 0) {
			_loc15_ = 2;
		}
	}
	if (_loc16_ <= 1) {
		_loc29_ = param1.x + _loc16_ * param2.x - param3.x;
		_loc30_ = param1.y + _loc16_ * param2.y - param3.y;
		_loc31_ = _loc29_ * -_loc18_ + _loc30_ * _loc17_;
		_loc32_ = _loc29_ * -_loc20_ + _loc30_ * _loc19_;
		if (_loc31_ * _loc23_ <= 0 || _loc32_ * _loc24_ >= 0) {
			_loc16_ = 2;
		}
	}
	return Math.min(_loc15_, _loc16_);
};

export const getSingleClosestPointSigned = (
	gridSegment: GridSegment,
	param2: Vector2,
	offset: number,
	closestPointOut: Vector2
): number => {
	let _loc5_ = 0;
	const smallestWidth = Number.POSITIVE_INFINITY;
	const segments = gridSegment.gatherCellContentsFromWorldspaceRegion(
		param2.x - offset,
		param2.y - offset,
		param2.x + offset,
		param2.y + offset
	);

	for (const segment of segments) {
		const closestPoint = new Vector2();
		const _loc8_ = segment.getClosestPointIsBackfacing(param2, closestPoint);
		const diffX = closestPoint.x - param2.x;
		const diffY = closestPoint.y - param2.y;
		const squaredLength = diffX * diffX + diffY * diffY;
		if (!_loc8_) {
			squaredLength -= 0.1;
		}
		if (squaredLength < smallestWidth) {
			closestPointOut.setFrom(closestPoint);
			smallestWidth = squaredLength;
			if (_loc8_) {
				_loc5_ = -1;
			} else {
				_loc5_ = 1;
			}
		}
	}
	return _loc5_;
};
