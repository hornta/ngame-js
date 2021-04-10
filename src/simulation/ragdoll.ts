import type { CollisionResultLogical } from "./collision-result-logical";
import type { CollisionResultPhysical } from "./collision-result-physical";
import type { EntityBase } from "./entities/entity-base";
import type { RagdollParticle } from "./ragdoll-particle";
import type { RagdollStick } from "./ragdoll-stick";
import type { Simulator } from "./simulator";
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
	currentState: RagdollState;
	explosionAccumulator: number;
	particleList: RagdollParticle[][];
	stickList: RagdollStick[][];
	resultLogical: CollisionResultLogical;
	resultPhysical: CollisionResultPhysical;
	cp: Vector2;

	constructor() {
		this.currentState = RagdollState.UNEXPLODED;
		this.explosionAccumulator = 0;
		this.particleList = {
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
		this.stickList = {
			[RagdollState.UNEXPLODED]: [
				new RagdollStick(
					this.particleList[RagdollState.UNEXPLODED][1],
					this.particleList[RagdollState.UNEXPLODED][0],
					stickWeight[0],
					stickMinRatio[0],
					stickMaxLength[0]
				),
				new RagdollStick(
					this.particleList[RagdollState.UNEXPLODED][0],
					this.particleList[RagdollState.UNEXPLODED][2],
					stickWeight[1],
					stickMinRatio[1],
					stickMaxLength[1]
				),
				new RagdollStick(
					this.particleList[RagdollState.UNEXPLODED][0],
					this.particleList[RagdollState.UNEXPLODED][3],
					stickWeight[2],
					stickMinRatio[2],
					stickMaxLength[2]
				),
				new RagdollStick(
					this.particleList[RagdollState.UNEXPLODED][1],
					this.particleList[RagdollState.UNEXPLODED][4],
					stickWeight[3],
					stickMinRatio[3],
					stickMaxLength[3]
				),
				new RagdollStick(
					this.particleList[RagdollState.UNEXPLODED][1],
					this.particleList[RagdollState.UNEXPLODED][5],
					stickWeight[4],
					stickMinRatio[4],
					stickMaxLength[4]
				),
			],
			[RagdollState.EXPLODED]: [
				new RagdollStick(
					this.particleList[RagdollState.EXPLODED][1],
					this.particleList[RagdollState.EXPLODED][0],
					stickWeight[0],
					stickMinRatio[0],
					stickMaxLength[0]
				),
				new RagdollStick(
					this.particleList[RagdollState.EXPLODED][6],
					this.particleList[RagdollState.EXPLODED][2],
					stickWeight[1],
					stickMinRatio[1],
					stickMaxLength[1]
				),
				new RagdollStick(
					this.particleList[RagdollState.EXPLODED][7],
					this.particleList[RagdollState.EXPLODED][3],
					stickWeight[2],
					stickMinRatio[2],
					stickMaxLength[2]
				),
				new RagdollStick(
					this.particleList[RagdollState.EXPLODED][8],
					this.particleList[RagdollState.EXPLODED][4],
					stickWeight[3],
					stickMinRatio[3],
					stickMaxLength[3]
				),
				new RagdollStick(
					this.particleList[RagdollState.EXPLODED][9],
					this.particleList[RagdollState.EXPLODED][5],
					stickWeight[4],
					stickMinRatio[4],
					stickMaxLength[4]
				),
			],
		};
		this.resultLogical = new CollisionResultLogical();
		this.resultPhysical = new CollisionResultPhysical();
		this.cp = new Vector2();
	}

	integrate(gravity: number): void {
		for (const p of this.particleList[this.currentState]) {
			p.preIntegrate(gravity);
		}
	}

	solveConstraints(): void {
		for (const stick of this.stickList[this.currentState]) {
			stick.solve();
		}
	}

	collideVsObjects(simulator: Simulator): void {
		this.resultPhysical.clear();
		for (const particle of this.particleList[this.currentState]) {
			const entityList = simulator.entityGrid.gatherCellContentsInNeighbourhood(
				particle.solverPosition
			);
			for (const entity of entityList) {
				if (
					entity.collideVsCirclePhysical(
						this.resultPhysical,
						particle.solverPosition,
						particle.velocity,
						particle.position,
						particle.r
					)
				) {
					this.respondToCollision(
						simulator,
						particle,
						this.resultPhysical.nx,
						this.resultPhysical.ny,
						this.resultPhysical.pen
					);
				}
			}
		}
	}

	private respondToCollision(
		simulator: Simulator,
		particle: RagdollParticle,
		param3: number,
		param4: number,
		param5: number
	): void {
		let _loc13_ = NaN;
		particle.solverPosition.x += param5 * param3;
		particle.solverPosition.y += param5 * param4;
		let _loc6_ = 0;
		let _loc7_ = 0.05;
		let _loc8_ = 0;
		const _loc9_ = particle.solverPosition.x - particle.position.x;
		const _loc10_ = particle.solverPosition.y - particle.position.y;
		const _loc11_ = _loc9_ * param3 + _loc10_ * param4;
		const _loc12_ = _loc9_ * -param4 + _loc10_ * param3;
		if (_loc11_ < 0) {
			_loc6_ = 2;
			_loc7_ = 0.15;
			_loc8_ = 1;
			if (_loc11_ < -3) {
				// simulator
				// 	.HACKY_GetParticleManager()
				// 	.Spawn_RagBloodSpurt(
				// 		particle.solverPosition.x,
				// 		particle.solverPosition.y,
				// 		-_loc11_ * param3,
				// 		-_loc11_ * param4
				// 	);
				if ((_loc13_ = Math.random()) < 0.33) {
					// simulator.HACKY_GetSoundManager().PlaySound_Ragdoll("hard1");
				} else if (_loc13_ < 0.66) {
					// simulator.HACKY_GetSoundManager().PlaySound_Ragdoll("hard2");
				} else {
					// simulator.HACKY_GetSoundManager().PlaySound_Ragdoll("hard3");
				}
			} else {
				if (0.7 < _loc12_ * _loc12_) {
					// simulator
					// 	.HACKY_GetParticleManager()
					// 	.Spawn_RagDust(
					// 		particle.solverPosition,
					// 		particle.r,
					// 		_loc12_ * -param4,
					// 		_loc12_ * param3,
					// 		_loc12_ * _loc12_
					// 	);
				}
				if (_loc11_ < -2) {
					if (Math.random() < 0.5) {
						// simulator.HACKY_GetSoundManager().PlaySound_Ragdoll("med1");
					} else {
						// simulator.HACKY_GetSoundManager().PlaySound_Ragdoll("med2");
					}
				} else if (_loc11_ < -1.2) {
					if (Math.random() < 0.5) {
						// simulator.HACKY_GetSoundManager().PlaySound_Ragdoll("soft1");
					} else {
						// simulator.HACKY_GetSoundManager().PlaySound_Ragdoll("soft2");
					}
				}
			}
		}
		particle.position.x +=
			_loc8_ * param5 * param3 +
			_loc6_ * _loc11_ * param3 +
			_loc7_ * _loc12_ * -param4;
		particle.position.y +=
			_loc8_ * param5 * param4 +
			_loc6_ * _loc11_ * param4 +
			_loc7_ * _loc12_ * param3;
	}

	public collideVsTiles(simulator: Simulator): void {
		let _loc4_: int = 0;
		let _loc5_: int = 0;
		let _loc6_: int = 0;
		let _loc7_ = NaN;
		let _loc8_ = NaN;
		let _loc9_ = NaN;
		let _loc10_ = NaN;

		for (const particle of this.particleList[this.currentState]) {
			_loc4_ = 32;
			_loc5_ = 0;
			this.cp.x = 0;
			this.cp.y = 0;
			while (
				(_loc6_ = colutils.GetSingleClosestPoint_Signed(
					simulator.segGrid,
					particle.solver_pos,
					particle.r * 4,
					this.cp
				)) != 0
			) {
				_loc7_ = particle.solver_pos.x - this.cp.x;
				_loc8_ = particle.solver_pos.y - this.cp.y;
				_loc9_ = Math.sqrt(_loc7_ * _loc7_ + _loc8_ * _loc8_);
				if ((_loc10_ = particle.r - _loc6_ * _loc9_) < 1e-7) {
					break;
				}
				if (_loc9_ === 0) {
					return;
				}
				_loc7_ /= _loc9_;
				_loc8_ /= _loc9_;
				this.respondToCollision(
					simulator,
					particle,
					_loc7_,
					_loc8_,
					_loc6_ * _loc10_
				);
				_loc5_++;
				if (_loc5_ >= _loc4_) {
					throw new Error(
						`WARNING! ragdoll collision loop hit max iterations: ${_loc10_} [${particle}]`
					);
				}
			}
		}
	}
}
