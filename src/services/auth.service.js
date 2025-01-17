import bcrypt from "bcrypt";
import { ACCESS_TOKEN_EXPIRES_IN, HASH_SALT_ROUNDS } from "../constants/auth.constant.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constants/env.constant.js";
import { HttpError } from "../errors/http.error.js";
import { MESSAGES } from "../constants/message.constant.js";

class AuthService {
	constructor(authRepository) {
		this.authRepository = authRepository;
	}

	signUp = async (email, password, name) => {
		const existedUser = await this.authRepository.findUserByEmail(email);

		if (existedUser) {
			throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
		}

		const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);

		const data = await this.authRepository.createUser(email, hashedPassword, name);
		data.password = undefined;
		return data;
	}

	signIn = async (email, password) => {
		const existedUser = await this.authRepository.findUserByEmail(email);

		const isPasswordMatched = existedUser && bcrypt.compareSync(password, existedUser.password);

		if (!isPasswordMatched) {
			throw new HttpError.BadRequest(MESSAGES.AUTH.SIGN_IN.FAILED);
		}

		const payload = { id: existedUser.id };

		const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });

		return accessToken;
	}

	upload = async (userId, profileImageUrl) => {
		if (!profileImageUrl) {
			throw new HttpError.NotFound("이미지를 첨부해주세요.");
		}

		const url = await this.authRepository.upload(userId, profileImageUrl);

		return url;
	}
}

export { AuthService };