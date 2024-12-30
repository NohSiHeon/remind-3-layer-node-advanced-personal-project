import { MESSAGES } from "../constants/message.constant.js";
import { HttpError } from "../errors/http.error.js";

class ResumeService {
	constructor(resumeRepository) {
		this.resumeRepository = resumeRepository;
	}

	createResume = async (title, content, authorId) => {
		const resume = await this.resumeRepository.createResume(title, content, authorId);

		return resume;
	}

	getResumes = async (authorId, sort) => {
		let resumes = await this.resumeRepository.findResumes(authorId, sort);

		if (!resumes) {
			throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
		}

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

	getResume = async (authorId, id) => {
		let resume = await this.resumeRepository.findResumeAndAuthorByIdAndAuthorId(authorId, id);

		if (!resume) {
			throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
		}

		resume = {
			id: resume.id,
			authorName: resume.author.name,
			title: resume.title,
			content: resume.content,
			status: resume.status,
			createdAt: resume.createdAt,
			updatedAt: resume.updatedAt
		};

		return resume;
	}

	updateResume = async (authorId, id, title, content) => {
		const existedResume = await this.resumeRepository.findResumeByIdAndAuthorId(id, authorId);

		if (!existedResume) {
			throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
		}

		const updatedResume = await this.resumeRepository.updateResume(id, authorId, title, content);

		return updatedResume;
	}

	deleteResume = async (authorId, id) => {
		const existedResume = await this.resumeRepository.findResumeByIdAndAuthorId(id, authorId);

		if (!existedResume) {
			throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
		}

		const deleteResume = await this.resumeRepository.deleteResume(authorId, id);

		return deleteResume.id;
	}
}

export { ResumeService };