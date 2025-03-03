import { transporter } from "../configs/mail.config.js";
import { sse } from "../configs/sse.config.js";
import { NODE_MAILER_USER } from "../constants/env.constant.js";
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

	getApplies = async (userId, userRole, sort, skip, limit) => {
		if (userRole == 'APPLICANT') {
			const applies = await this.applyRepository.findAppliesByUserIdForApplicant(userId, sort, skip, limit);
			if (!applies) {
				throw new HttpError.NotFound(MESSAGES.APPLIES.COMMON.NOT_FOUND);
			}
			return applies;
		}

		const applies = await this.applyRepository.findAppliesByUserIdForRecruiter(userId, sort, skip, limit);

		if (!applies) {
			throw new HttpError.NotFound(MESSAGES.APPLIES.COMMON.NOT_FOUND);
		}

		return applies;
	}

	getApply = async (userId, id) => {

		const apply = await this.applyRepository.findApplyByUserIdAndApplyId(userId, id);

		if (!apply) {
			throw new HttpError.NotFound(MESSAGES.APPLIES.COMMON.NOT_FOUND);
		}

		return apply;
	}

	updateStatus = async (userId, id, status) => {
		const apply = await this.applyRepository.findApplyByUserIdAndApplyIdForRecruiter(userId, id);

		if (!apply) {
			throw new HttpError.NotFound(MESSAGES.APPLIES.COMMON.NOT_FOUND);
		}

		const updateStatusApply = await this.applyRepository.updateStatus(userId, id, status);
		await this.sendMail(updateStatusApply.user.email, updateStatusApply.jobPosting.title);
		await sse.send({ message: '지원상태가 변경되었습니다.', status: updateStatusApply.status });
		return updateStatusApply;
	}

	cancelApplyJobPosting = async (userId, id) => {
		const apply = await this.applyRepository.findApplyByUserIdAndApplyId(userId, id);

		if (!apply) {
			throw new HttpError.NotFound(MESSAGES.APPLIES.COMMON.NOT_FOUND);
		}

		const cancelApply = await this.applyRepository.cancelApplyJobPosting(userId, id);

		return cancelApply;
	}

	sendMail = async (email, jobPostingTitle,) => {
		await transporter.sendMail({
			from: NODE_MAILER_USER,
			to: email,
			subject: `${jobPostingTitle} 채용 상태 업데이트 안내`,
			text: `${jobPostingTitle}에대한 귀하의 지원 상태가 업데이트 되었습니다. 확인 부탁드립니다.`
		});
	}
}

export { ApplyService };