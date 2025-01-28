import bcrypt from "bcrypt";
import { ACCESS_TOKEN_EXPIRES_IN, HASH_SALT_ROUNDS } from "../constants/auth.constant.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, NAVER_CALLBACK_URL, NAVER_CLIENT_ID, NAVER_CLIENT_SECRET } from "../constants/env.constant.js";
import { HttpError } from "../errors/http.error.js";
import { MESSAGES } from "../constants/message.constant.js";
import crypto from 'crypto';
import axios from "axios";

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

	// 네이버 소셜 로그인 state 생성
	generateState = async () => {
		const state = await crypto.randomBytes(16).toString('hex');
		return state;
	}

	// 네이버 소셜 로그인 인증 URL 생성
	generateAuthUrl = async (state) => {
		const clientId = NAVER_CLIENT_ID;
		const redirectURI = encodeURIComponent(NAVER_CALLBACK_URL);
		return `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectURI}&state=${state}`;
	}

	// 네이버 소셜 로그인 토큰 생성
	getAccessToken = async (code, state) => {
		const clientId = NAVER_CLIENT_ID;
		const clientSecret = NAVER_CLIENT_SECRET;
		const redirectURI = encodeURIComponent(NAVER_CALLBACK_URL);

		const apiUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectURI}&code=${code}&state=${state}`;

		// 토큰 생성되는 URL 통신
		try {
			const response = await axios.get(apiUrl, {
				headers: {
					'X-Naver-Client-Id': clientId,
					'X-Naver-Client-Secret': clientSecret,
				}
			});

			return response.data;
		} catch (error) {
			throw new Error(`토큰 요청 실패: ${error.response?.status || error.message}`);
		}
	}

	// 소셜 로그인 유저 프로필 조회
	getProfile = async (accessToken) => {

		const profileData = await axios.get('https://openapi.naver.com/v1/nid/me', {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		return profileData.data.response;
	}

	createSocialUser = async (email, name) => {
		// 이미 가입한 이메일인지 확인
		const user = await this.authRepository.findUserByEmail(email);

		if (user) {
			console.log("이미 가입한 이메일입니다.");
		} else {
			// 소셜 유저 회원가입
			await this.authRepository.createSocialUser(email, name);
		}

	}
}

export { AuthService };