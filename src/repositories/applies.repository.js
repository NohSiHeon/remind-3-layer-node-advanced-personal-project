import { MESSAGES } from "../constants/message.constant.js";
import { HttpError } from "../errors/http.error.js";

class ApplyRepository {
	constructor(prisma, jobPostingRepository) {
		this.prisma = prisma;
		this.jobPostingRepository = jobPostingRepository;
	}

	// applyJobPosting = async (userId, resumeId, jobPostingId) => {
	// 	const apply = await this.prisma.apply.create({
	// 		data: {
	// 			userId,
	// 			resumeId,
	// 			jobPostingId
	// 		}
	// 	});

	// 	return apply;
	// }
	applyJobPosting = async (userId, resumeId, jobPostingId) => {
		return await this.prisma.$transaction(async (tx) => {
			const existingApply = await this.findApply(tx, userId, jobPostingId);

			if (existingApply) {
				throw new HttpError.Conflict(MESSAGES.APPLIES.COMMON.ALREADY_APPLIED);
			}

			const apply = await this.createApply(tx, userId, resumeId, jobPostingId);
			await this.jobPostingRepository.incrementApplicantCount(tx, jobPostingId);

			return apply;
		})
	}

	findApply = async (tx, userId, jobPostingId) => {
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
}

export { ApplyRepository };