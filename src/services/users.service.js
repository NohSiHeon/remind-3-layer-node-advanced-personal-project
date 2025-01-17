import { HttpError } from "../errors/http.error.js";

class UserService {
	constructor(userRepository) {
		this.userRepository = userRepository;
	}
	profile = async (userId, profileImageUrl) => {
		if (!profileImageUrl) {
			throw new HttpError.NotFound("이미지를 첨부해주세요.");
		}
		const type = profileImageUrl.split(".")[5];
		const isPossibleType = ['jpeg', 'jpg', 'png'].filter(v => v == type);

		if (isPossibleType.length == 0) {
			throw new HttpError.BadRequest("불가능한 파일 형식입니다.");
		}

		const url = this.userRepository.profile(userId, profileImageUrl);

		return url;
	}
}

export { UserService };