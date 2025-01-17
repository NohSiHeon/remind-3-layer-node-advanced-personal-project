import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";

class UsersController {
	constructor(userService) {
		this.userService = userService;
	}

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

	profile = async (req, res, next) => {
		try {
			const user = req.user;
			const userId = user.id;
			const profileImageUrl = req.file?.location;

			const data = await this.userService.profile(userId, profileImageUrl);

			return res.status(HTTP_STATUS.OK).json({
				status: HTTP_STATUS.OK,
				message: "프로필 수정에 성공하였습니다.",
				data
			})
		} catch (error) {
			next(error);
		}
	}
}

export { UsersController };