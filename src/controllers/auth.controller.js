import axios from "axios";
import { NAVER_CALLBACK_URL, NAVER_CLIENT_ID, NAVER_CLIENT_SECRET } from "../constants/env.constant.js";
import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";

class AuthController {
	constructor(authService) {
		this.authService = authService;
	}
	signUp = async (req, res, next) => {
		try {
			const { email, password, name } = req.body;
			const data = await this.authService.signUp(email, password, name);

			return res.status(HTTP_STATUS.CREATED).json({
				status: HTTP_STATUS.OK,
				message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
				data
			});
		} catch (error) {
			next(error);
		}
	}

	signIn = async (req, res, next) => {
		try {
			const { email, password } = req.body;

			const data = await this.authService.signIn(email, password);

			return res.status(HTTP_STATUS.OK).json({
				status: HTTP_STATUS.OK,
				message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
				data
			});

		} catch (error) {
			next(error);
		}
	}

	upload = async (req, res, next) => {
		try {
			const user = req.user;
			const userId = user.id;
			const profileImageUrl = req.file?.location;

			const data = await this.authService.upload(userId, profileImageUrl);
			return res.status(HTTP_STATUS.OK).json({
				status: HTTP_STATUS.OK,
				data
			});
		} catch (error) {
			next(error);
		}
	}

	naverLogin = async (req, res, next) => {
		try {
			const state = await this.authService.generateState();	// state 값 생성
			const apiUrl = await this.authService.generateAuthUrl(state);	// 네이버 인증 URL 생성

			req.session.state = state;	// 생성한 state를 세션에 저장

			// 네이버 인증 URL로 리다이렉트하는 링크를 사용자에게 제공
			res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
			res.end(`<a href="${apiUrl}"><img height="50" src="http://static.nid.naver.com/oauth/small_g_in.PNG"/></a>`);
		} catch (error) {
			next(error);
		}
	}

	naverLoginCallback = async (req, res, next) => {
		try {
			const { code, state: receivedState } = req.query;
			const savedState = req.session.state;

			if (receivedState !== savedState) {
				throw new Error('유효하지 않은 state 값입니다.');
			}
			// 토큰 생성
			const tokenData = await this.authService.getAccessToken(code, receivedState);

			// 소셜 로그인에 성공했을 경우
			if (tokenData.access_token) {
				const accessToken = tokenData.access_token;
				// 유저의 프로필 조회해서 DB에 넣을 데이터 가져오기
				const profileData = await this.authService.getProfile(accessToken);

				// 소셜 전용 회원가입
				await this.authService.createSocialUser(profileData.email, profileData.name);

			}

			// 소셜 로그인에 실패했을 경우
			if (!tokenData.access_token) {
				// 에러가 발생했을 경우
				throw new Error("실패")
			}

			res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
			res.end(JSON.stringify(tokenData));


		} catch (error) {
			next(error);
		}
	}
}

export { AuthController };