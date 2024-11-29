import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";

class UsersController {

	me = async (req, res, next) => {
		try {
			const data = req.user;

			return res.status(HTTP_STATUS.OK).json({
				status: HTTP_STATUS.OK,
				message: MESSAGES.USERS.READ_ME.SUCCEED,
				data
			});
		} catch (error) {
			next(error);
		}
	};
}

export { UsersController };