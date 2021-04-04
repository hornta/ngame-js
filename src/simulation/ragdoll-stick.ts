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
}
