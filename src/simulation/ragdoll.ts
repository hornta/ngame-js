import type { CollisionResultLogical } from "./collision-result-logical";
import type { CollisionResultPhysical } from "./collision-result-physical";
import type { EntityBase } from "./entities/entity-base";
import type { RagdollParticle } from "./ragdoll-particle";
import type { RagdollStick } from "./ragdoll-stick";
import type { Vector2 } from "./vector2";

enum RagdollState {
	UNEXPLODED = 0,
	EXPLODED = 1,
}

const particleRadius = [2.49, 2.49, 1.99, 1.99, 2.99, 2.99];
const particleDrag = [0.99, 0.995, 0.995, 0.99, 0.99, 0.995];
const stickWeight = [0.4, 0.2, 0.26, 0.32, 0.37];
const stickMinRatio = [0.8, 0.6, 0.6, 0.6, 0.6];
const stickMaxLength = [6, 8, 8, 12, 12];

export class Ragdoll {
	currentstate: RagdollState;
	explosionAccumulator: number;
	pList: RagdollParticle[][];
	sList: RagdollStick[][];
	entityList: EntityBase[];
	resultLogical: CollisionResultLogical;
	resultPhysical: CollisionResultPhysical;
	cp: Vector2;

	constructor() {
		this.currentstate = RagdollState.UNEXPLODED;
		this.explosionAccumulator = 0;
		this.pList = {
			[RagdollState.UNEXPLODED]: [
				new RagdollParticle(particleRadius[0], particleDrag[0]),
				new RagdollParticle(particleRadius[1], particleDrag[1]),
				new RagdollParticle(particleRadius[2], particleDrag[2]),
				new RagdollParticle(particleRadius[3], particleDrag[3]),
				new RagdollParticle(particleRadius[4], particleDrag[4]),
				new RagdollParticle(particleRadius[5], particleDrag[5]),
			],
			[RagdollState.EXPLODED]: [
				new RagdollParticle(particleRadius[0], particleDrag[0]),
				new RagdollParticle(particleRadius[1], particleDrag[1]),
				new RagdollParticle(particleRadius[2], particleDrag[2]),
				new RagdollParticle(particleRadius[3], particleDrag[3]),
				new RagdollParticle(particleRadius[4], particleDrag[4]),
				new RagdollParticle(particleRadius[5], particleDrag[5]),
				new RagdollParticle(particleRadius[0], particleDrag[0]),
				new RagdollParticle(particleRadius[0], particleDrag[0]),
				new RagdollParticle(particleRadius[1], particleDrag[1]),
				new RagdollParticle(particleRadius[1], particleDrag[1]),
			],
		};
		this.sList = {
			[RagdollState.UNEXPLODED]: [
				new RagdollStick(
					this.pList[RagdollState.UNEXPLODED][1],
					this.pList[RagdollState.UNEXPLODED][0],
					stickWeight[0],
					stickMinRatio[0],
					stickMaxLength[0]
				),
				new RagdollStick(
					this.pList[RagdollState.UNEXPLODED][0],
					this.pList[RagdollState.UNEXPLODED][2],
					stickWeight[1],
					stickMinRatio[1],
					stickMaxLength[1]
				),
				new RagdollStick(
					this.pList[RagdollState.UNEXPLODED][0],
					this.pList[RagdollState.UNEXPLODED][3],
					stickWeight[2],
					stickMinRatio[2],
					stickMaxLength[2]
				),
				new RagdollStick(
					this.pList[RagdollState.UNEXPLODED][1],
					this.pList[RagdollState.UNEXPLODED][4],
					stickWeight[3],
					stickMinRatio[3],
					stickMaxLength[3]
				),
				new RagdollStick(
					this.pList[RagdollState.UNEXPLODED][1],
					this.pList[RagdollState.UNEXPLODED][5],
					stickWeight[4],
					stickMinRatio[4],
					stickMaxLength[4]
				),
			],
			[RagdollState.EXPLODED]: [
				new RagdollStick(
					this.pList[RagdollState.EXPLODED][1],
					this.pList[RagdollState.EXPLODED][0],
					stickWeight[0],
					stickMinRatio[0],
					stickMaxLength[0]
				),
				new RagdollStick(
					this.pList[RagdollState.EXPLODED][6],
					this.pList[RagdollState.EXPLODED][2],
					stickWeight[1],
					stickMinRatio[1],
					stickMaxLength[1]
				),
				new RagdollStick(
					this.pList[RagdollState.EXPLODED][7],
					this.pList[RagdollState.EXPLODED][3],
					stickWeight[2],
					stickMinRatio[2],
					stickMaxLength[2]
				),
				new RagdollStick(
					this.pList[RagdollState.EXPLODED][8],
					this.pList[RagdollState.EXPLODED][4],
					stickWeight[3],
					stickMinRatio[3],
					stickMaxLength[3]
				),
				new RagdollStick(
					this.pList[RagdollState.EXPLODED][9],
					this.pList[RagdollState.EXPLODED][5],
					stickWeight[4],
					stickMinRatio[4],
					stickMaxLength[4]
				),
			],
		};
		this.entityList = [];
		this.resultLogical = new CollisionResultLogical();
		this.resultPhysical = new CollisionResultPhysical();
		this.cp = new Vector2();
	}
}
