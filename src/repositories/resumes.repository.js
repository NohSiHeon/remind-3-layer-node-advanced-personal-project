class ResumeRepository {
	constructor(prisma) {
		this.prisma = prisma;
	}

	createResume = async (title, content, authorId) => {
		const resume = await this.prisma.resume.create({
			data: {
				authorId,
				title,
				content
			}
		});

		return resume;
	}

	findResumes = async (authorId, sort) => {
		const resumes = await this.prisma.resume.findMany({
			where: { authorId },
			orderBy: {
				createdAt: sort,
			},
			include: {
				author: true
			}
		});

		return resumes;
	}

	findResumeAndAuthorByIdAndAuthorId = async (authorId, id) => {
		const resume = await this.prisma.resume.findUnique({
			where: {
				id: +id,
				authorId
			},
			include: { author: true },
		});

		return resume;
	}

	findResumeByIdAndAuthorId = async (id, authorId) => {
		const resume = await this.prisma.resume.findUnique({
			where: {
				id: +id,
				authorId
			}
		});

		return resume;
	}

	updateResume = async (id, authorId, title, content) => {
		const updatedResume = await this.prisma.resume.update({
			where: {
				id: +id,
				authorId
			},
			data: {
				...(title && { title }),
				...(content && { content }),
			},
		});

		return updatedResume;
	}

	deleteResume = async (authorId, id) => {
		const deletedResume = await this.prisma.resume.delete({
			where: {
				id: +id,
				authorId
			},
		});

		return deletedResume;
	}
}

export { ResumeRepository };