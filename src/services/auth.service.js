import bcrypt from "bcrypt";
import { ACCESS_TOKEN_EXPIRES_IN, HASH_SALT_ROUNDS } from "../constants/auth.constant.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, NAVER_CALLBACK_URL, NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, REFRESH_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SECRET } from "../constants/env.constant.js";
import { HttpError } from "../errors/http.error.js";
import { MESSAGES } from "../constants/message.constant.js";
import crypto from 'crypto';
import axios from "axios";

class AuthService {
	constructor(authRepository, redisClient) {
		this.authRepository = authRepository;
		this.redisClient = redisClient;
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
		await this.redisClient.set(`accessToken:userId:${existedUser.id}`, accessToken, { EX: 3600 });

		const existedRefreshToken = await this.authRepository.findRefreshTokenByUserId(existedUser.id);
		if (!existedRefreshToken) {
			const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
			await this.authRepository.createRefreshToken(existedUser.id, refreshToken);

			return { accessToken, refreshToken };
		}

		return { accessToken, refreshToken: existedRefreshToken.refreshToken };
	}

	logOut = async (userId) => {
		const user = await this.authRepository.findUserById(userId);

		if (!user) {
			throw new HttpError.NotFound(MESSAGES.AUTH.COMMON.JWT.NO_USER);
		}

		const refreshToken = await this.authRepository.findRefreshTokenByUserId(userId);
		if (!refreshToken) {
			throw new HttpError.NotFound(MESSAGES.AUTH.COMMON.JWT.NO_TOKEN);
		}

		await this.authRepository.logOut(userId);
		await this.redisClient.del(`accessToken:userId:${user.id}`);

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
		let user = await this.authRepository.findUserByEmail(email);

		// 신규 유저일 경우 회원가입
		if (!user) {
			user = await this.authRepository.createSocialUser(email, name);
		}
		// 리프레쉬 토큰이 이미 있는지 조회(이미 가입했을 경우 있음)
		let jwtRefreshToken = await this.authRepository.findRefreshTokenByUserId(user.id);
		// 리프레쉬 토큰이 없을 경우 새로 만들고 DB에 저장
		if (!jwtRefreshToken) {
			jwtRefreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
			await this.authRepository.createRefreshToken(user.id, jwtRefreshToken);
		} else {
			jwtRefreshToken = jwtRefreshToken.refreshToken;
		}

		// 서비스에서 사용하는 액세스 토큰 생성 및 저장
		const jwtAccessToken = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
		await this.redisClient.set(`accessToken:userId:${user.id}`, jwtAccessToken, { EX: 3600 });

		return { jwtAccessToken, jwtRefreshToken };
	}
}

export { AuthService };