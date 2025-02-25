import { MESSAGES } from "../constants/message.constant.js";
import { HttpError } from "../errors/http.error.js";

class ApplyRepository {
	constructor(prisma, jobPostingRepository) {
		this.prisma = prisma;
		this.jobPostingRepository = jobPostingRepository;
	}

	applyJobPosting = async (userId, resumeId, jobPostingId) => {
		return await this.prisma.$transaction(async (tx) => {
			const existingApply = await this.findApplyByUserIdAndJobPostingIdUsingTx(tx, userId, jobPostingId);

			if (existingApply) {
				throw new HttpError.Conflict(MESSAGES.APPLIES.COMMON.ALREADY_APPLIED);
			}

			const apply = await this.createApply(tx, userId, resumeId, jobPostingId);
			await this.jobPostingRepository.incrementApplicantCount(tx, jobPostingId);

			return apply;
		})
	}

	findApplyByUserIdAndJobPostingIdUsingTx = async (tx, userId, jobPostingId) => {
		const apply = await tx.apply.findUnique({
			where: {
				userId_jobPostingId: {
					userId: +userId,
					jobPostingId: +jobPostingId
				}
			}
		});

		return apply;
	}

	createApply = async (tx, userId, resumeId, jobPostingId) => {
		const apply = await tx.apply.create({
			data: {
				userId: +userId,
				resumeId: +resumeId,
				jobPostingId: +jobPostingId
			},
			include: {
				resume: {
					select: { title: true }
				},
				jobPosting: {
					select: { title: true }
				},
				user: {
					select: { name: true }
				}
			}
		});

		return apply;
	}

	findAppliesByUserIdForApplicant = async (userId) => {
		const applies = await this.prisma.apply.findMany({
			where: {
				userId: +userId
			}
		});

		return applies;
	}

	findAppliesByUserIdForRecruiter = async (userId) => {
		const applies = await this.prisma.apply.findMany({
			where: {
				jobPosting: {
					recruiterId: +userId
				}
			},
			include: {
				jobPosting: {
					select: { recruiterId: true }
				}
			}
		});

		return applies;
	}

	findApplyByUserIdAndApplyId = async (userId, id) => {
		const apply = await this.prisma.apply.findUnique({
			where: {
				userId: +userId,
				id: +id
			}
		});

		return apply;
	}

	findApplyByUserIdAndApplyIdForRecruiter = async (userId, id) => {
		const apply = await this.prisma.apply.findUnique({
			where: {
				id: +id,
				jobPosting: {
					recruiterId: +userId
				}
			},
			include: {
				jobPosting: {
					select: { recruiterId: true }
				}
			}
		});

		return apply;
	}

	updateStatus = async (userId, id, status) => {
		const apply = await this.prisma.apply.update({
			where: {
				id: +id,
				jobPosting: {
					recruiterId: +userId
				}
			},
			data: {
				status
			},
			include: {
				jobPosting: {
					select: {
						recruiterId: true,
						title: true
					}
				},
				user: {
					select: { email: true }
				}
			}
		});

		return apply;
	}

	cancelApplyJobPosting = async (userId, id) => {
		return await this.prisma.$transaction(async (tx) => {
			const apply = await this.findApplyByUserIdAndApplyIdUsingTx(tx, userId, id);
			if (!apply) {
				throw new HttpError.NotFound(MESSAGES.APPLIES.COMMON.NOT_FOUND);
			}
			const cancelApply = await this.deleteApply(tx, userId, id);
			await this.jobPostingRepository.decrementApplicantCount(tx, cancelApply.jobPostingId);

			return cancelApply.id;
		});
	}

	findApplyByUserIdAndApplyIdUsingTx = async (tx, userId, id) => {
		const apply = await tx.apply.findUnique({
			where: {
				userId: +userId,
				id: +id
			}
		});

		return apply;
	}

	deleteApply = async (tx, userId, id) => {
		const apply = await tx.apply.delete({
			where: {
				userId: +userId,
				id: +id
			}
		});

		return apply;
	}
}

export { ApplyRepository };