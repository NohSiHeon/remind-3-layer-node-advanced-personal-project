class JobPostingRepository {
	constructor(prisma) {
		this.prisma = prisma;
	}

	createJobPosting = async (recruiterId, title, name, location, salary, jobType, description) => {
		const jobPosting = await this.prisma.jobPosting.create({
			data: {
				recruiterId,
				title,
				name,
				location,
				salary,
				jobType,
				description
			}
		});
		return jobPosting;
	}

	findJobPostingById = async (id) => {
		const jobPosting = await this.prisma.jobPosting.findUnique({
			where: {
				id: +id
			}
		});

		return jobPosting;
	}

	findJobPostings = async (sort, skip, limit) => {
		const jobPostings = await this.prisma.jobPosting.findMany({
			skip: +skip,
			take: +limit,
			orderBy: {
				createdAt: sort
			}
		});

		return jobPostings;
	}

	updateJobPosting = async (recruiterId, id, title, name, location, salary, jobType, description) => {
		const jobPosting = await this.prisma.jobPosting.update({
			where: {
				id: +id,
				recruiterId: +recruiterId
			},
			data: {
				...(title && { title }),
				...(name && { name }),
				...(location && { location }),
				...(salary && { salary }),
				...(jobType && { jobType }),
				...(description && { description }),
			}
		});

		return jobPosting;
	}

	deleteJobPosting = async (id, recruiterId) => {
		const deletedJobPosting = await this.prisma.jobPosting.delete({
			where: {
				id: +id,
				recruiterId: +recruiterId
			}
		});

		return deletedJobPosting;
	}
	incrementApplicantCount = async (tx, jobPostingId) => {
		await tx.jobPosting.update({
			where: {
				id: jobPostingId
			},
			data: {
				applicantCount: {
					increment: 1
				}
			}
		});
	}

	decrementApplicantCount = async (tx, jobPostingId) => {
		await tx.jobPosting.update({
			where: {
				id: +jobPostingId
			},
			data: {
				applicantCount: {
					decrement: 1
				}
			}
		});
	}
}

export { JobPostingRepository };