class ResumesRepository {
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
		let resumes = await this.prisma.resume.findMany({
			where: { authorId },
			orderBy: {
				createdAt: sort,
			},
			include: {
				author: true
			}
		});

		resumes = resumes.map((resume) => {
			return {
				id: resume.id,
				authorName: resume.author.name,
				title: resume.title,
				content: resume.content,
				status: resume.status,
				createdAt: resume.createdAt,
				updatedAt: resume.updatedAt
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

export { ResumesRepository };