import bcrypt from "bcrypt";
import { ACCESS_TOKEN_EXPIRES_IN, HASH_SALT_ROUNDS } from "../constants/auth.constant.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constants/env.constant.js";

class AuthService {
	constructor(authRepository) {
		this.authRepository = authRepository;
	}

	signUp = async (email, password, name) => {
		const existedUser = await this.authRepository.findUserByEmail(email);

		if (existedUser) {
			return 1;
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
			return 1;
		}

		const payload = { id: existedUser.id };

		const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });

		return accessToken;
	}
}

export { AuthService };