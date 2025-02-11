import { AWS_S3_BUCKET } from "../constants/env.constant.js";
import { HttpError } from "../errors/http.error.js";
import { s3, upload } from "../middlewares/s3.middleware.js";

class UserService {
	constructor(userRepository) {
		this.userRepository = userRepository;
	}
	profile = async (userId, image) => {
		if (!image) {
			throw new HttpError.NotFound("이미지를 첨부해주세요.");
		}
		const type = image.originalname.split(".").pop();

		const isPossibleType = ['jpeg', 'jpg', 'png'].filter(v => v == type);

		if (isPossibleType.length == 0) {
			throw new HttpError.BadRequest("불가능한 파일 형식입니다.");
		}
		const profileImageUrl = await this.uploadToS3(image);
		const url = this.userRepository.profile(userId, profileImageUrl);

		return url;
	}
	// S3로 이미지 업로드
	uploadToS3 = async (file) => {
		const params = {
			Bucket: AWS_S3_BUCKET,
			Key: `uploads/${Date.now()}-${file.originalname}`,
			Body: file.buffer,
			ContentType: file.mimetype,
			ACL: 'public-read'
		};
		const result = await s3.upload(params).promise();
		return result.Location;
	}
}

export { UserService };