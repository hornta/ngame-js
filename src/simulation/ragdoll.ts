import { getSingleClosestPointSigned } from "../fns";
import { CollisionResultLogical } from "./collision-result-logical.js";
import { CollisionResultPhysical } from "./collision-result-physical.js";
import { EntityDroneZap } from "./entities/entity-drone-zap";
import { EntityFloorGuard } from "./entities/entity-floor-guard";
import { EntityMine } from "./entities/entity-mine";
import { EntityThwomp } from "./entities/entity-thwomp";
import { RagdollParticle } from "./ragdoll-particle.js";
import { RagdollStick } from "./ragdoll-stick.js";
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
		const maxIterations = 32;

		for (const particle of this.particleList[this.currentState]) {
			let numIterations = 0;
			const closestPoint = new Vector2(0, 0);
			const _loc6_ = getSingleClosestPointSigned(
				simulator.segGrid,
				particle.solverPosition,
				particle.r * 4,
				closestPoint
			);
			while (_loc6_ !== 0) {
				const _loc7_ = particle.solverPosition.x - closestPoint.x;
				const _loc8_ = particle.solverPosition.y - closestPoint.y;
				const _loc9_ = Math.sqrt(_loc7_ * _loc7_ + _loc8_ * _loc8_);
				const _loc10_ = particle.r - _loc6_ * _loc9_;
				if (_loc10_ < 1e-7) {
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
				numIterations++;
				if (numIterations === maxIterations) {
					throw new Error(
						`WARNING! ragdoll collision loop hit max iterations: ${_loc10_} [${particle}]`
					);
				}
			}
		}
	}

	private initUnexplodedParticles(): void {
		this.particleList[RagdollState.EXPLODED][0].copyState(
			this.particleList[RagdollState.UNEXPLODED][0]
		);
		this.particleList[RagdollState.EXPLODED][1].copyState(
			this.particleList[RagdollState.UNEXPLODED][1]
		);
		this.particleList[RagdollState.EXPLODED][2].copyState(
			this.particleList[RagdollState.UNEXPLODED][2]
		);
		this.particleList[RagdollState.EXPLODED][3].copyState(
			this.particleList[RagdollState.UNEXPLODED][3]
		);
		this.particleList[RagdollState.EXPLODED][4].copyState(
			this.particleList[RagdollState.UNEXPLODED][4]
		);
		this.particleList[RagdollState.EXPLODED][5].copyState(
			this.particleList[RagdollState.UNEXPLODED][5]
		);
		this.particleList[RagdollState.EXPLODED][6].copyState(
			this.particleList[RagdollState.UNEXPLODED][0]
		);
		this.particleList[RagdollState.EXPLODED][7].copyState(
			this.particleList[RagdollState.UNEXPLODED][0]
		);
		this.particleList[RagdollState.EXPLODED][8].copyState(
			this.particleList[RagdollState.UNEXPLODED][1]
		);
		this.particleList[RagdollState.EXPLODED][9].copyState(
			this.particleList[RagdollState.UNEXPLODED][1]
		);
		this.particleList[RagdollState.EXPLODED][6].velocity.x += 2;
		this.particleList[RagdollState.EXPLODED][7].velocity.y += 4;
		this.particleList[RagdollState.EXPLODED][8].velocity.y -= 6;
		this.particleList[RagdollState.EXPLODED][9].velocity.x -= 8;
	}

	public explodeRagdoll(simulator: Simulator): void {
		if (this.currentState !== RagdollState.EXPLODED) {
			this.currentState = RagdollState.EXPLODED;
			this.initUnexplodedParticles();
			for (let i = 6; i < 10; ++i) {
				// simulator
				// 	.HACKY_GetParticleManager()
				// 	.Spawn_BloodSpurt(
				// 		this.particleList[RagdollState.EXPLODED][i].position.x,
				// 		this.particleList[RagdollState.EXPLODED][i].position.y,
				// 		Math.random() * 8 - 4,
				// 		Math.random() * 8 - 4,
				// 		3
				// 	);
			}
		}
	}

	public postCollision(simulator: Simulator): void {
		for (const particle of this.particleList[this.currentState]) {
			particle.postIntegrate();
		}

		this.resultLogical.clear();

		for (const particle of this.particleList[this.currentState]) {
			const entities = simulator.entityGrid.gatherCellContentsInNeighbourhood(
				particle.position
			);
			for (const entity of entities) {
				if (
					entity.collideVsCirclePhysical(
						simulator,
						null,
						this.resultLogical,
						particle.pos,
						particle.vel,
						particle.pos,
						particle.r,
						0.1
					)
				) {
					particle.velocity.x += this.resultLogical.vectorX;
					particle.velocity.y += this.resultLogical.vectorY;
					if (entity instanceof EntityMine) {
						if (this.currentState === RagdollState.UNEXPLODED) {
							this.explosionAccumulator += Math.random() * 0.6;
							if (Math.random() < this.explosionAccumulator) {
								this.explodeRagdoll(simulator);
							}
						}
					} else if (
						entity instanceof EntityDroneZap ||
						entity instanceof EntityFloorGuard ||
						entity instanceof EntityThwomp
					) {
						if (Math.random() < 0.5) {
							// simulator.HACKY_GetSoundManager().PlaySound_Ragdoll("zap1");
						} else {
							// simulator.HACKY_GetSoundManager().PlaySound_Ragdoll("zap2");
						}
					}
				}
			}
		}
	}

	public activateRagdoll(
		param1: Vector2,
		param2: Vector2,
		param3: Vector2,
		param4: Vector2,
		param5: Vector2[],
		param6: Vector2[]
	): void {
		let _loc7_: Vector2[] = null;
		let _loc8_: Vector2[] = null;
		this.currentState = RagdollState.UNEXPLODED;
		this.explosionAccumulator = 0;
		if (param5 !== null && param6 !== null) {
			_loc7_ = param5;
			_loc8_ = param6;
		} else {
			throw new Error(
				"WARNING! ragdoll wasn't passed in a pose.. this should never happen."
			);
		}
		this.particleList[RagdollState.UNEXPLODED][0].setState(
			param1.x + _loc7_[0].x,
			param1.y + _loc7_[0].y,
			param2.x + _loc8_[0].x,
			param2.y + _loc8_[0].y
		);
		this.particleList[RagdollState.UNEXPLODED][1].setState(
			param1.x + _loc7_[1].x,
			param1.y + _loc7_[1].y,
			param2.x + _loc8_[1].x,
			param2.y + _loc8_[1].y
		);
		this.particleList[RagdollState.UNEXPLODED][2].setState(
			param1.x + _loc7_[2].x,
			param1.y + _loc7_[2].y,
			param2.x + _loc8_[2].x,
			param2.y + _loc8_[2].y
		);
		this.particleList[RagdollState.UNEXPLODED][3].setState(
			param1.x + _loc7_[3].x,
			param1.y + _loc7_[3].y,
			param2.x + _loc8_[3].x,
			param2.y + _loc8_[3].y
		);
		this.particleList[RagdollState.UNEXPLODED][4].setState(
			param1.x + _loc7_[4].x,
			param1.y + _loc7_[4].y,
			param2.x + _loc8_[4].x,
			param2.y + _loc8_[4].y
		);
		this.particleList[RagdollState.UNEXPLODED][5].setState(
			param1.x + _loc7_[5].x,
			param1.y + _loc7_[5].y,
			param2.x + _loc8_[5].x,
			param2.y + _loc8_[5].y
		);

		this.shoveRagdoll(param3, param4);
	}

	private shoveRagdoll(param1: Vector2, param2: Vector2): void {
		for (const particle of this.particleList[RagdollState.UNEXPLODED]) {
			const _loc7_ = particle.position.x - param1.x;
			const _loc8_ = particle.position.y - param1.y;
			const _loc9_ = Math.sqrt(_loc7_ * _loc7_ + _loc8_ * _loc8_);
			const _loc10_ = Math.min(1, _loc9_ / 12);
			const _loc11_ = 0.5 + (1 - _loc10_) * 1.5;
			particle.velocity.x += param2.x * _loc11_;
			particle.velocity.y += param2.y * _loc11_;
		}
	}
}
