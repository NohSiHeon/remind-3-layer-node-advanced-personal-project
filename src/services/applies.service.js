import { MESSAGES } from "../constants/message.constant.js";
import { HttpError } from "../errors/http.error.js";

class ApplyService {
	constructor(applyRepository, resumeRepository, jobPostingRepository) {
		this.applyRepository = applyRepository;
		this.resumeRepository = resumeRepository;
		this.jobPostingRepository = jobPostingRepository;
	}

	applyJobPosting = async (userId, resumeId, jobPostingId) => {
		const resume = await this.resumeRepository.findResumeByIdAndAuthorId(resumeId, userId);
		if (!resume) {
			throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
		}

		const jobPosting = await this.jobPostingRepository.findJobPostingById(jobPostingId);
		if (!jobPosting) {
			throw new HttpError.NotFound(MESSAGES.JOB_POSTINGS.COMMON.NOT_FOUND);
		}

		const apply = await this.applyRepository.applyJobPosting(userId, resumeId, jobPostingId);

		return apply;
	}

	getApplies = async (userId, userRole) => {
		if (userRole == 'APPLICANT') {
			const applies = await this.applyRepository.findAppliesByUserIdForApplicant(userId);
			if (!applies) {
				throw new HttpError.NotFound(MESSAGES.APPLIES.COMMON.NOT_FOUND);
			}
			return applies;
		}

		const applies = await this.applyRepository.findAppliesByUserIdForRecruiter(userId);

		if (!applies) {
			throw new HttpError.NotFound(MESSAGES.APPLIES.COMMON.NOT_FOUND);
		}

		return applies;
	}
}

export { ApplyService };