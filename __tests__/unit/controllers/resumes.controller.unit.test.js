import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { ResumeController } from '../../../src/controllers/resumes.controller.js';
import { dummyUsers } from '../../dummies/users.dummy.js';
import { dummyResumes } from '../../dummies/resumes.dummy.js';
import { RESUME_STATUS } from '../../../src/constants/resume.constant.js';
import { HTTP_STATUS } from '../../../src/constants/http-status.constant.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';


const mockResumesService = {
	createResume: jest.fn(),
	getResumes: jest.fn(),
	getResume: jest.fn(),
	updateResume: jest.fn(),
	deleteResume: jest.fn(),
};

const mockRequest = {
	user: jest.fn(),
	body: jest.fn(),
	query: jest.fn(),
	params: jest.fn(),
};

const mockResponse = {
	status: jest.fn(),
	json: jest.fn(),
};

const mockNext = jest.fn();

const resumesController = new ResumeController(mockResumesService);

describe('ResumesController Unit Test', () => {
	beforeEach(() => {
		jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

		// mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
		mockResponse.status.mockReturnValue(mockResponse);
	});

	test('create Method', async () => {
		// GIVEN
		const mockUser = dummyUsers[1];
		const authorId = dummyUsers[1].id;
		const { title, content } = dummyResumes[0];
		const mockBody = { title, content };
		const mockReturn = {
			id: 100,
			authorId,
			title,
			content,
			status: RESUME_STATUS.APPLY,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		mockRequest.user = mockUser;
		mockRequest.body = mockBody;
		mockResumesService.createResume.mockReturnValue(mockReturn);

		// WHEN
		await resumesController.createResume(mockRequest, mockResponse, mockNext);
		// THEN
		const expectedJsonCalledWith = {
			status: HTTP_STATUS.CREATED,
			message: MESSAGES.RESUMES.CREATE.SUCCEED,
			data: mockReturn
		};

		expect(mockResumesService.createResume).toHaveBeenCalledTimes(1);
		expect(mockResumesService.createResume).toHaveBeenCalledWith(title, content, authorId);

		expect(mockResponse.status).toHaveBeenCalledTimes(1);
		expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);

		expect(mockResponse.json).toHaveBeenCalledTimes(1);
		expect(mockResponse.json).toHaveBeenCalledWith(expectedJsonCalledWith);
	});

	test('readMany Method', async () => {
		// GIVEN
		const authorId = dummyUsers[1].id;
		const sort = 'desc';
		const mockUser = dummyUsers[1];
		const mockQuery = sort;
		let mockReturn = dummyResumes.filter((resume) => resume.authorId == authorId).sort((a, b) => b.createdAt - a.createdAt).map((resume) => {
			return {
				id: resume.id,
				authorName: resume.author.name,
				title: resume.title,
				content: resume.content,
				status: resume.status,
				createdAt: resume.createdAt,
				updatedAt: resume.updatedAt
			}
		});

		mockRequest.user = mockUser;
		mockRequest.query = mockQuery;

		mockResumesService.getResumes.mockReturnValue(mockReturn);
		// WHEN
		await resumesController.getResumes(mockRequest, mockResponse, mockNext);
		// THEN
		const expectedJsonCalledWith = {
			status: HTTP_STATUS.OK,
			message: MESSAGES.RESUMES.READ_LIST.SUCCEED,
			data: mockReturn
		};

		expect(mockResumesService.getResumes).toHaveBeenCalledTimes(1);
		expect(mockResumesService.getResumes).toHaveBeenCalledWith(authorId, sort);

		expect(mockResponse.status).toHaveBeenCalledTimes(1);
		expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

		expect(mockResponse.json).toHaveBeenCalledTimes(1);
		expect(mockResponse.json).toHaveBeenCalledWith(expectedJsonCalledWith);
	});

	test('readOne Method', async () => {
		// GIVEN
		const mockUser = dummyUsers[1];
		const authorId = mockUser.id;
		const id = 1;
		const mockParams = { id };
		let mockReturn = dummyResumes.filter((resume) => resume.id == id && resume.authorId == authorId)[0];
		mockReturn = {
			id: mockReturn.id,
			authorName: mockReturn.author.name,
			title: mockReturn.title,
			content: mockReturn.content,
			status: mockReturn.status,
			createdAt: mockReturn.createdAt,
			updatedAt: mockReturn.updatedAt
		}

		mockRequest.user = mockUser;
		mockRequest.params = mockParams;

		mockResumesService.getResume.mockReturnValue(mockReturn);
		// WHEN
		await resumesController.getResume(mockRequest, mockResponse, mockNext);
		// THEN
		const expectedJsonCalledWith = {
			status: HTTP_STATUS.OK,
			message: MESSAGES.RESUMES.READ_DETAIL.SUCCEED,
			data: mockReturn
		};

		expect(mockResumesService.getResume).toHaveBeenCalledTimes(1);
		expect(mockResumesService.getResume).toHaveBeenCalledWith(authorId, id);

		expect(mockResponse.status).toHaveBeenCalledTimes(1);
		expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

		expect(mockResponse.json).toHaveBeenCalledTimes(1);
		expect(mockResponse.json).toHaveBeenCalledWith(expectedJsonCalledWith);

	});

	test('update Method', async () => {
		// GIVEN
		const mockUser = dummyUsers[1];
		const authorId = mockUser.id;
		const id = 1;
		const title = "수정된 튼튼한 개발자 스파르탄";
		const content = "수정된 저는 튼튼함을 제 자랑거리로 선보일 수 있습니다. 어떤 도전이든 두려워하지 않고, 견고한 코드와 해결책을 제시할 자신이 있습니다. 복잡한 문제에 직면했을 때에도 냉정하게 분석하고 빠르게 대응하는 능력을 갖췄습니다. 또한, 팀원들과의 원활한 커뮤니케이션을 통해 프로젝트의 성공을 이끌어내는데 기여할 것입니다. 최고의 결과물을 위해 끊임없이 노력하며, 스파르타코딩클럽에서도 이 같은 튼튼함을 발휘하여 뛰어난 성과를 이루고자 합니다.";
		const mockParams = { id };
		const mockBody = {
			title,
			content
		}

		let mockReturn = dummyResumes.filter((resume) => resume.id == id && resume.authorId == authorId)[0];
		mockReturn = {
			id: mockReturn.id,
			authorId: mockReturn.authorId,
			title,
			content,
			status: mockReturn.status,
			createdAt: mockReturn.createdAt,
			updatedAt: mockReturn.updatedAt
		};

		mockRequest.user = mockUser;
		mockRequest.params = mockParams;
		mockRequest.body = mockBody;

		mockResumesService.updateResume.mockReturnValue(mockReturn);
		// WHEN
		await resumesController.updateResume(mockRequest, mockResponse, mockNext);
		// THEN
		const expectedJsonCalledWith = {
			status: HTTP_STATUS.OK,
			message: MESSAGES.RESUMES.UPDATE.SUCCEED,
			data: mockReturn
		};

		expect(mockResumesService.updateResume).toHaveBeenCalledTimes(1);
		expect(mockResumesService.updateResume).toHaveBeenCalledWith(authorId, id, title, content);

		expect(mockResponse.status).toHaveBeenCalledTimes(1);
		expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

		expect(mockResponse.json).toHaveBeenCalledTimes(1);
		expect(mockResponse.json).toHaveBeenCalledWith(expectedJsonCalledWith);

	});

	test('delete Method', async () => {
		// GIVEN
		const mockUser = dummyUsers[1];
		const id = 1;
		const authorId = dummyUsers[1].id;
		const mockParams = { id };
		let mockReturn = dummyResumes.filter(resume => resume.id == id && authorId == authorId)[0];
		mockReturn = mockReturn.id;

		mockRequest.user = mockUser;
		mockRequest.params = mockParams;
		mockResumesService.deleteResume.mockReturnValue(mockReturn);

		// WHEN
		await resumesController.deleteResume(mockRequest, mockResponse, mockNext);

		// THEN
		const expectedJsonCalledWith = {
			status: HTTP_STATUS.OK,
			message: MESSAGES.RESUMES.DELETE.SUCCEED,
			data: mockReturn
		};

		expect(mockResumesService.deleteResume).toHaveBeenCalledTimes(1);
		expect(mockResumesService.deleteResume).toHaveBeenCalledWith(authorId, id);

		expect(mockResponse.status).toHaveBeenCalledTimes(1);
		expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

		expect(mockResponse.json).toHaveBeenCalledTimes(1);
		expect(mockResponse.json).toHaveBeenCalledWith(expectedJsonCalledWith);
	});
});
