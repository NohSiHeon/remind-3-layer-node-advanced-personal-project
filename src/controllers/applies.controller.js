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

	getApply = async (req, res, next) => {
		try {
			const { id } = req.params;
			const user = req.user;
			const userId = user.id;

			const data = await this.applyService.getApply(userId, id);

			return res.status(HTTP_STATUS.OK).json({
				status: HTTP_STATUS.OK,
				message: MESSAGES.APPLIES.READ_DETAIL.SUCCEED,
				data
			})
		} catch (error) {
			next(error);
		}
	}

	updateStatus = async (req, res, next) => {
		try {
			const { id } = req.params;
			const { status } = req.body;
			const user = req.user;
			const userId = user.id;

			const data = await this.applyService.updateStatus(userId, id, status);
			return res.status(HTTP_STATUS.OK).json({
				status: HTTP_STATUS.OK,
				message: MESSAGES.APPLIES.UPDATE.SUCCEED,
				data
			})
		} catch (error) {
			next(error);
		}
	}
}

export { ApplyController };