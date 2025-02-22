import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";

class ApplyController {
	constructor(applyService) {
		this.applyService = applyService;
	}

	applyJobPosting = async (req, res, next) => {
		try {
			const user = req.user;
			const userId = user.id;
			const { resumeId, jobPostingId } = req.body;

			const data = await this.applyService.applyJobPosting(userId, resumeId, jobPostingId);

			return res.status(HTTP_STATUS.OK).json({
				status: HTTP_STATUS.OK,
				message: MESSAGES.APPLIES.CREATE.SUCCEED,
				data
			});
		} catch (error) {
			next(error);
		}
	}

	getApplies = async (req, res, next) => {
		try {
			const user = req.user;
			const userId = user.id;
			const userRole = user.role;

			const data = await this.applyService.getApplies(userId, userRole);
			return res.status(HTTP_STATUS.OK).json({
				status: HTTP_STATUS.OK,
				message: MESSAGES.APPLIES.READ_LIST.SUCCEED,
				data
			})
		} catch (error) {
			next(error);
		}
	}
}

export { ApplyController };