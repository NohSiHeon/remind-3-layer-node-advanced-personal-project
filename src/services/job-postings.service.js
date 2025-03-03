import { MESSAGES } from "../constants/message.constant.js";
import { HttpError } from "../errors/http.error.js";

class JobPostingService {
	constructor(jobPostingRepository) {
		this.jobPostingRepository = jobPostingRepository;
	}

	createJobPosting = async (recruiterId, title, name, location, salary, jobType, description) => {

		const jobPosting = await this.jobPostingRepository.createJobPosting(recruiterId, title, name, location, salary, jobType, description);

		return jobPosting;
	}

	getJobPosting = async (id) => {
		const jobPosting = await this.jobPostingRepository.findJobPostingById(id);

		if (!jobPosting) {
			throw new HttpError.NotFound(MESSAGES.JOB_POSTINGS.COMMON.NOT_FOUND);
		}

		return jobPosting;
	}

	getJobPostings = async (sort, skip, limit) => {
		const jobPostings = await this.jobPostingRepository.findJobPostings(sort, skip, limit);

		if (!jobPostings) {
			throw new HttpError.NotFound(MESSAGES.JOB_POSTINGS.COMMON.NOT_FOUND);
		}
		return jobPostings;
	}

	updateJobPosting = async (recruiterId, id, title, name, location, salary, jobType, description) => {

		const jobPosting = await this.jobPostingRepository.findJobPostingById(id);
		if (!jobPosting) {
			throw new HttpError.NotFound(MESSAGES.JOB_POSTINGS.COMMON.NOT_FOUND);
		}
		const updatedJobPosting = await this.jobPostingRepository.updateJobPosting(recruiterId, id, title, name, location, salary, jobType, description);

		return updatedJobPosting;
	}

	deleteJobPosting = async (id, recruiterId) => {
		const jobPosting = await this.jobPostingRepository.findJobPostingById(id);
		if (!jobPosting) {
			throw new HttpError.NotFound(MESSAGES.JOB_POSTINGS.DELETE.SUCCEED);
		}

		const deletedJobPosting = await this.jobPostingRepository.deleteJobPosting(id, recruiterId);

		return { id: deletedJobPosting.id };
	}
}

export { JobPostingService };