import { HTTP_STATUS } from "../constants/http-status.constant.js";
import { MESSAGES } from "../constants/message.constant.js";

class ResumeController {
	constructor(resumeService) {
		this.resumeService = resumeService;
	}

	// 이력서 생성
	createResume = async (req, res, next) => {
		try {
			const user = req.user;
			const { title, content } = req.body;
			const authorId = user.id;
			const data = await this.resumeService.createResume(title, content, authorId);

			return res.status(HTTP_STATUS.CREATED).json({
				status: HTTP_STATUS.CREATED,
				message: MESSAGES.RESUMES.CREATE.SUCCEED,
				data
			});
		} catch (error) {
			next(error);
		}
	}

	// 이력서 목록 조회
	getResumes = async (req, res, next) => {
		try {
			const user = req.user;
			const authorId = user.id;
			let { sort } = req.query;

			sort = sort?.toLowerCase();

			if (sort !== 'desc' && sort !== 'asc') {
				sort = 'desc';
			}

			const data = await this.resumeService.getResumes(authorId, sort);

			return res.status(HTTP_STATUS.OK).json({
				status: HTTP_STATUS.OK,
				message: MESSAGES.RESUMES.READ_LIST.SUCCEED,
				data
			});
		} catch (error) {
			next(error);
		}
	}

	// 이력서 상세 조회
	getResume = async (req, res, next) => {
		try {
			const user = req.user;
			const authorId = user.id;
			const { id } = req.params;
			const data = await this.resumeService.getResume(authorId, id);

			return res.status(HTTP_STATUS.OK).json({
				status: HTTP_STATUS.OK,
				message: MESSAGES.RESUMES.READ_DETAIL.SUCCEED,
				data
			});
		} catch (error) {
			next(error);
		}
	}

	// 이력서 수정
	updateResume = async (req, res, next) => {
		try {
			const user = req.user;
			const authorId = user.id;
			const { id } = req.params;
			const { title, content } = req.body;

			const data = await this.resumeService.updateResume(authorId, id, title, content);

			return data;
		} catch (error) {
			next(error);
		}
	}

	// 이력서 삭제
	deleteResume = async (req, res, next) => {
		try {
			const user = req.user;
			const authorId = user.id;
			const { id } = req.params;

			const data = await this.resumeService.deleteResume(authorId, id);

			return res.status(HTTP_STATUS.OK).json({
				status: HTTP_STATUS.OK,
				message: MESSAGES.RESUMES.DELETE.SUCCEED,
				data
			});
		} catch (error) {
			next(error);
		}
	}
}

export { ResumeController };