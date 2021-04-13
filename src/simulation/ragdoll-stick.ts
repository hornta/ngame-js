import type { RagdollParticle } from "./ragdoll-particle";

export class RagdollStick {
	particle0: RagdollParticle;
	particle1: RagdollParticle;
	weight0: number;
	weight1: number;
	minLength: number;
	maxLength: number;

	constructor(
		particle0: RagdollParticle,
		particle1: RagdollParticle,
		weight: number,
		minLength: number,
		maxLength: number
	) {
		this.particle0 = particle0;
		this.particle1 = particle1;
		this.weight0 = weight;
		this.weight1 = 1 - weight;
		this.minLength = maxLength * minLength;
		this.maxLength = maxLength;
	}

	public solve(): void {
		const _loc1_ =
			this.particle1.solverPosition.x - this.particle0.solverPosition.x;
		const _loc2_ =
			this.particle1.solverPosition.y - this.particle0.solverPosition.y;
		const squaredLength = Math.sqrt(_loc1_ * _loc1_ + _loc2_ * _loc2_);
		if (this.minLength <= squaredLength && squaredLength <= this.maxLength) {
			return;
		}
		const _loc4_ = Math.max(
			this.minLength,
			Math.min(this.maxLength, squaredLength)
		);
		const _loc5_ = squaredLength - _loc4_;
		let _loc6_ = 1;
		let _loc7_ = 0;
		if (squaredLength !== 0) {
			_loc6_ = _loc1_ / squaredLength;
			_loc7_ = _loc2_ / squaredLength;
		}
		this.particle0.solverPosition.x -= this.weight0 * -_loc5_ * _loc6_;
		this.particle0.solverPosition.y -= this.weight0 * -_loc5_ * _loc7_;
		this.particle1.solverPosition.x += this.weight1 * -_loc5_ * _loc6_;
		this.particle1.solverPosition.y += this.weight1 * -_loc5_ * _loc7_;
	}
}
