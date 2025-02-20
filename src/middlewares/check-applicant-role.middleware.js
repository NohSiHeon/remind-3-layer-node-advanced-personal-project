import { MESSAGES } from "../constants/message.constant.js";
import { HttpError } from "../errors/http.error.js";

export const checkApplicantRoleMiddleware = async (req, res, next) => {
	try {
		const user = req.user;
		const role = user.role;

		if (role !== 'APPLICANT') {
			throw new HttpError.Forbidden(MESSAGES.APPLIES.COMMON.FORBIDDEN);
		}

		next();
	} catch (error) {
		next(error);
	}
}