import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";

class JobPostingController {
	constructor(jobPostingService) {
		this.jobPostingService = jobPostingService;
	}

	createJobPosting = async (req, res, next) => {
		try {
			const user = req.user;
			const recruiterId = user.id;
			const { title, name, location, salary, jobType, description } = req.body;

			const data = await this.jobPostingService.createJobPosting(recruiterId, title, name, location, salary, jobType, description);

			return res.status(HTTP_STATUS.CREATED).json({
				status: HTTP_STATUS.CREATED,
				message: '채용 공고 생성에 성공했습니다.',
				data
			})
		} catch (error) {
			next(error);
		}
	}

	getJobPosting = async (req, res, next) => {
		try {
			const { id } = req.params;
			const data = await this.jobPostingService.getJobPosting(id);

			return res.status(HTTP_STATUS.OK).json({
				status: HTTP_STATUS.OK,
				message: MESSAGES.JOB_POSTINGS.READ_DETAIL.SUCCEED,
				data
			});
		} catch (error) {
			next(error);
		}
	}

	getJobPostings = async (req, res, next) => {
		try {
			let { sort } = req.query;
			sort = sort?.toLowerCase();
			if (!sort) sort = 'desc';
			const { page, limit } = req.query;
			const skip = (page - 1) * limit;

			const data = await this.jobPostingService.getJobPostings(sort, page, skip, limit);
			return res.status(HTTP_STATUS.OK).json({
				status: HTTP_STATUS.OK,
				message: MESSAGES.JOB_POSTINGS.READ_LIST.SUCCEED,
				data
			})
		} catch (error) {
			next(error);
		}
	}

	updateJobPosting = async (req, res, next) => {
		try {
			const user = req.user;
			const recruiterId = user.id;
			const { id } = req.params;
			const { title, name, location, salary, jobType, description } = req.body;

			const data = await this.jobPostingService.updateJobPosting(recruiterId, id, title, name, location, salary, jobType, description);
			return res.status(HTTP_STATUS.OK).json({
				status: HTTP_STATUS.OK,
				message: MESSAGES.JOB_POSTINGS.UPDATE.SUCCEED,
				data
			});
		} catch (error) {
			next(error);
		}
	}

	deleteJobPosting = async (req, res, next) => {
		try {

			const { id } = req.params;
			const user = req.user;
			const recruiterId = user.id;

			const data = await this.jobPostingService.deleteJobPosting(id, recruiterId);
			return res.status(HTTP_STATUS.OK).json({
				status: HTTP_STATUS.OK,
				message: MESSAGES.JOB_POSTINGS.DELETE.SUCCEED,
				data
			});
		} catch (error) {
			next(error);
		}
	}
}

export { JobPostingController };