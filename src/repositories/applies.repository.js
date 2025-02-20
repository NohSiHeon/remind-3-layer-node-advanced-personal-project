class ApplyRepository {
	constructor(prisma) {
		this.prisma = prisma;
	}

	applyJobPosting = async (userId, resumeId, jobPostingId) => {
		const apply = await this.prisma.apply.create({
			data: {
				userId,
				resumeId,
				jobPostingId
			}
		});

		return apply;
	}

	findApply = async (userId, jobPostingId) => {
		const apply = await this.prisma.apply.findUnique({
			where: {
				userId_jobPostingId: {
					userId: +userId,
					jobPostingId: +jobPostingId
				}
			}
		});

		return apply;
	}
}

export { ApplyRepository };