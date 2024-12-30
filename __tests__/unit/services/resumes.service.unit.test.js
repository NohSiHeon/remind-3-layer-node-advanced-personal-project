import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { ResumeService } from '../../../src/services/resumes.service.js'
import { dummyResumes } from '../../dummies/resumes.dummy.js';
import { RESUME_STATUS } from '../../../src/constants/resume.constant.js';
import { HttpError } from '../../../src/errors/http.error.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';


const mockResumesRepository = {
	createResume: jest.fn(),
	findResumes: jest.fn(),
	findResumeAndAuthorByIdAndAuthorId: jest.fn(),
	findResumeByIdAndAuthorId: jest.fn(),
	updateResume: jest.fn(),
	deleteResume: jest.fn(),
};

const resumesService = new ResumeService(mockResumesRepository);

describe('ResumesService Unit Test', () => {
	beforeEach(() => {
		jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
	});

	test('create Method', async () => {
		// GIVEN
		const { authorId, title, content } = dummyResumes[0];
		const mockReturn = {
			id: 100,
			authorId,
			title,
			content,
			status: RESUME_STATUS.APPLY,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		mockResumesRepository.createResume.mockReturnValue(mockReturn);

		// WHEN
		const actualResult = await resumesService.createResume(title, content, authorId);
		// THEN
		const expectedResult = mockReturn;

		expect(mockResumesRepository.createResume).toHaveBeenCalledTimes(1);
		expect(mockResumesRepository.createResume).toHaveBeenCalledWith(title, content, authorId);
		expect(actualResult).toEqual(expectedResult);
	});

	test('readMany Method', async () => {
		// GIVEN
		const authorId = 1;
		const sort = 'asc';

		const mockReturn = dummyResumes.filter((resume) => resume.authorId == authorId).sort((a, b) => a.createdAt - b.createdAt);
		mockResumesRepository.findResumes.mockReturnValue(mockReturn);

		// WHEN
		const actualResult = await resumesService.getResumes(authorId, sort);

		// THEN
		const expectedResult = mockReturn.map((resume) => {
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

		expect(mockResumesRepository.findResumes).toHaveBeenCalledTimes(1);
		expect(mockResumesRepository.findResumes).toHaveBeenCalledWith(authorId, sort);
		expect(actualResult).toEqual(expectedResult);
	});

	test('readOne Method', async () => {
		// GIVEN
		const authorId = 1;
		const id = "1";


		let mockReturn = dummyResumes.filter((resume) => resume.id == +id);
		mockReturn = mockReturn[0];

		mockResumesRepository.findResumeAndAuthorByIdAndAuthorId.mockReturnValue(mockReturn);

		// WHEN
		const actualResult = await resumesService.getResume(authorId, id);

		// THEN
		let expectedResult = mockReturn;
		expectedResult = {
			id: expectedResult.id,
			authorName: expectedResult.author.name,
			title: expectedResult.title,
			content: expectedResult.content,
			status: expectedResult.status,
			createdAt: expectedResult.createdAt,
			updatedAt: expectedResult.updatedAt
		};

		expect(mockResumesRepository.findResumeAndAuthorByIdAndAuthorId).toHaveBeenCalledTimes(1);
		expect(mockResumesRepository.findResumeAndAuthorByIdAndAuthorId).toHaveBeenCalledWith(authorId, id);
		expect(actualResult).toEqual(expectedResult);

	});

	test('readOne Method - 이력서 없는 경우', async () => {
		// GIVEN
		const authorId = 1;
		const id = "1";


		let mockReturn = null;

		mockResumesRepository.findResumeAndAuthorByIdAndAuthorId.mockReturnValue(mockReturn);

		// WHEN
		try {
			await resumesService.getResume(authorId, id);

		} catch (error) {
			// THEN

			expect(mockResumesRepository.findResumeAndAuthorByIdAndAuthorId).toHaveBeenCalledTimes(1);
			expect(mockResumesRepository.findResumeAndAuthorByIdAndAuthorId).toHaveBeenCalledWith(authorId, id);
			expect(error).toEqual(new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND));
		}


	});

	test('update Method', async () => {
		// GIVEN
		const authorId = 1;
		const id = 1;
		const title = "수정된 튼튼한 개발자 스파르탄";
		const content = "수정된 저는 튼튼함을 제 자랑거리로 선보일 수 있습니다. 어떤 도전이든 두려워하지 않고, 견고한 코드와 해결책을 제시할 자신이 있습니다. 복잡한 문제에 직면했을 때에도 냉정하게 분석하고 빠르게 대응하는 능력을 갖췄습니다. 또한, 팀원들과의 원활한 커뮤니케이션을 통해 프로젝트의 성공을 이끌어내는데 기여할 것입니다. 최고의 결과물을 위해 끊임없이 노력하며, 스파르타코딩클럽에서도 이 같은 튼튼함을 발휘하여 뛰어난 성과를 이루고자 합니다.";
		const mockFindReturn = {
			...dummyResumes[+id],
		};

		const mockUpdateReturn = {
			...dummyResumes[+id],
			title,
			content
		};

		mockResumesRepository.findResumeByIdAndAuthorId.mockReturnValue(mockFindReturn);
		mockResumesRepository.updateResume.mockReturnValue(mockUpdateReturn);
		// WHEN
		const actualResult = await resumesService.updateResume(authorId, id, title, content);

		// THEN
		const expectedResult = mockUpdateReturn;

		expect(mockResumesRepository.findResumeByIdAndAuthorId).toHaveBeenCalledTimes(1);
		expect(mockResumesRepository.findResumeByIdAndAuthorId).toHaveBeenCalledWith(id, authorId);

		expect(mockResumesRepository.updateResume).toHaveBeenCalledTimes(1);
		expect(mockResumesRepository.updateResume).toHaveBeenCalledWith(authorId, id, title, content);
		expect(actualResult).toEqual(expectedResult);
	});

	test('update Method - 이력서 없는 경우', async () => {
		// GIVEN
		const authorId = 1;
		const id = 1;
		const title = "수정된 튼튼한 개발자 스파르탄";
		const content = "수정된 저는 튼튼함을 제 자랑거리로 선보일 수 있습니다. 어떤 도전이든 두려워하지 않고, 견고한 코드와 해결책을 제시할 자신이 있습니다. 복잡한 문제에 직면했을 때에도 냉정하게 분석하고 빠르게 대응하는 능력을 갖췄습니다. 또한, 팀원들과의 원활한 커뮤니케이션을 통해 프로젝트의 성공을 이끌어내는데 기여할 것입니다. 최고의 결과물을 위해 끊임없이 노력하며, 스파르타코딩클럽에서도 이 같은 튼튼함을 발휘하여 뛰어난 성과를 이루고자 합니다.";
		const mockFindReturn = null;

		const mockUpdateReturn = {
			...dummyResumes[+id],
			title,
			content
		};
		mockResumesRepository.findResumeByIdAndAuthorId.mockReturnValue(mockFindReturn);
		mockResumesRepository.updateResume.mockReturnValue(mockUpdateReturn);

		// WHEN
		try {
			await resumesService.updateResume(authorId, id, title, content);

		} catch (error) {
			// THEN
			expect(mockResumesRepository.findResumeByIdAndAuthorId).toHaveBeenCalledTimes(1);
			expect(mockResumesRepository.findResumeByIdAndAuthorId).toHaveBeenCalledWith(id, authorId);

			expect(error).toEqual(new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND));
		}
	});

	test('delete Method', async () => {
		// GIVEN
		const authorId = 1;
		const id = 1;

		const mockFindReturn = {
			...dummyResumes[+id],
		}

		const mockDeleteReturn = dummyResumes[+id];


		mockResumesRepository.findResumeByIdAndAuthorId.mockReturnValue(mockFindReturn);
		mockResumesRepository.deleteResume.mockReturnValue(mockDeleteReturn);

		// WHEN
		const actualResult = await resumesService.deleteResume(authorId, id);

		// THEN
		const expectedResult = mockDeleteReturn.id;

		expect(mockResumesRepository.findResumeByIdAndAuthorId).toHaveBeenCalledTimes(1);
		expect(mockResumesRepository.findResumeByIdAndAuthorId).toHaveBeenCalledWith(id, authorId);
		expect(mockResumesRepository.deleteResume).toHaveBeenCalledTimes(1);
		expect(mockResumesRepository.deleteResume).toHaveBeenCalledWith(authorId, id);

		expect(actualResult).toEqual(expectedResult);
	});

	test('delete Method - 이력서 없는 경우', async () => {
		// GIVEN
		const authorId = 1;
		const id = 1;

		const mockFindReturn = null;

		mockResumesRepository.findResumeByIdAndAuthorId.mockReturnValue(mockFindReturn);

		// WHEN
		try {
			await resumesService.deleteResume(authorId, id);

		} catch (error) {
			// THEN
			expect(mockResumesRepository.findResumeByIdAndAuthorId).toHaveBeenCalledTimes(1);
			expect(mockResumesRepository.findResumeByIdAndAuthorId).toHaveBeenCalledWith(id, authorId);
			expect(error).toEqual(new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND));

		}

	});
});
