import { MESSAGES } from "../constants/message.constant.js";
import { HttpError } from "../errors/http.error.js";

export const checkRecruiterRoleMiddleware = async (req, res, next) => {
	try {
		const role = req.user.role;
		if (role !== 'RECRUITER') {
			throw new HttpError.Forbidden(MESSAGES.JOB_POSTINGS.COMMON.FORBIDDEN_RECRUITER_ACCESS);
		}
		next();
	} catch (error) {
		next(error);
	}
}