import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import { ResumesRepository } from '../../../src/repositories/resumes.repository.js';
import { dummyResumes } from '../../dummies/resumes.dummy.js';
import { RESUME_STATUS } from '../../../src/constants/resume.constant.js';

const mockPrisma = {
	resume: {
		create: jest.fn(),
		findMany: jest.fn(),
		findUnique: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	},
};

const resumesRepository = new ResumesRepository(mockPrisma);

describe('ResumesRepository Unit Test', () => {
	beforeEach(() => {
		jest.resetAllMocks(); // 모든 Mock을 초기화합니다
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
			updatedAt: new Date(),
		};

		mockPrisma.resume.create.mockReturnValue(mockReturn);

		// WHEN
		const actualResult = await resumesRepository.createResume(
			title,
			content,
			authorId,
		);

		// THEN
		const expectedResult = mockReturn;

		expect(mockPrisma.resume.create).toHaveBeenCalledTimes(1);
		expect(mockPrisma.resume.create).toBeCalledWith({
			data: {
				authorId,
				title,
				content,
			}
		})
		expect(actualResult).toEqual(expectedResult);
	});

	test('readMany Method', async () => {
		// GIVEN
		const authorId = 1;
		const sort = 'asc';

		const mockReturn = dummyResumes.filter(resume => resume.authorId === authorId).sort((a, b) => a.createdAt - b.createdAt);

		mockPrisma.resume.findMany.mockReturnValue(mockReturn);

		// WHEN
		const actualResult = await resumesRepository.findResumes(
			authorId,
			sort
		);

		// THEN
		const expectedResult = mockReturn.map(resume => {
			return {
				...resume,
				authorName: resume.author.name,
				authorId: undefined,
				author: undefined
			}
		});

		expect(mockPrisma.resume.findMany).toHaveBeenCalledTimes(1);
		expect(mockPrisma.resume.findMany).toBeCalledWith({
			where: { authorId },
			orderBy: {
				createdAt: sort,
			},
			include: {
				author: true
			}
		});
		expect(actualResult).toEqual(expectedResult);

	});

	test('readOne Method', async () => {
		// GIVEN
		const id = "1";
		const authorId = 1;

		const mockReturn = dummyResumes[+id];

		mockPrisma.resume.findUnique.mockReturnValue(mockReturn);

		// WHEN
		const actualResult = await resumesRepository.findResumeAndAuthorByIdAndAuthorId(
			+id,
			authorId
		);

		// THEN
		const expectedResult = mockReturn;

		expect(mockPrisma.resume.findUnique).toHaveBeenCalledTimes(1);
		expect(mockPrisma.resume.findUnique).toBeCalledWith({
			where: {
				id: +id,
				authorId
			},
			include: { author: true },
		});
		expect(actualResult).toEqual(expectedResult);
	});

	test('update Method', async () => {
		// GIVEN
		const authorId = 1;
		const id = "1";
		const title = '매우 튼튼한 개발자 스파르탄';
		const content = '아주 그냥 저는 튼튼함을 제 자랑거리로 선보일 수 있습니다. 어떤 도전이든 두려워하지 않고, 견고한 코드와 해결책을 제시할 자신이 있습니다. 복잡한 문제에 직면했을 때에도 냉정하게 분석하고 빠르게 대응하는 능력을 갖췄습니다. 또한, 팀원들과의 원활한 커뮤니케이션을 통해 프로젝트의 성공을 이끌어내는데 기여할 것입니다. 최고의 결과물을 위해 끊임없이 노력하며, 스파르타코딩클럽에서도 이 같은 튼튼함을 발휘하여 뛰어난 성과를 이루고자 합니다.';

		const mockReturn = {
			...dummyResumes[+id],
			title,
			content
		}

		mockPrisma.resume.update.mockReturnValue(mockReturn);

		// WHEN
		const actualResult = await resumesRepository.updateResume(
			id,
			authorId,
			title,
			content
		);

		// THEN
		const expectedResult = mockReturn;

		expect(mockPrisma.resume.update).toHaveBeenCalledTimes(1);
		expect(mockPrisma.resume.update).toBeCalledWith({
			where: {
				id: +id,
				authorId
			},
			data: {
				...(title && { title }),
				...(content && { content }),
			}
		});
		expect(actualResult).toEqual(expectedResult);
	});

	test('update Method - title 만 있는 경우', async () => {
		// GIVEN
		const authorId = 1;
		const id = "1";
		const title = '매우 튼튼한 개발자 스파르탄';
		const content = undefined;

		const mockReturn = {
			...dummyResumes[+id],
			title,
			content
		}

		mockPrisma.resume.update.mockReturnValue(mockReturn);

		// WHEN
		const actualResult = await resumesRepository.updateResume(
			id,
			authorId,
			title,
			content
		);

		// THEN
		const expectedResult = mockReturn;

		expect(mockPrisma.resume.update).toHaveBeenCalledTimes(1);
		expect(mockPrisma.resume.update).toBeCalledWith({
			where: {
				id: +id,
				authorId
			},
			data: {
				title,
				content
			}
		});
		expect(actualResult).toEqual(expectedResult);
	});

	test('update Method - content 만 있는 경우', async () => {
		// GIVEN
		const authorId = 1;
		const id = "1";
		const title = undefined;
		const content = '아주 그냥 저는 튼튼함을 제 자랑거리로 선보일 수 있습니다. 어떤 도전이든 두려워하지 않고, 견고한 코드와 해결책을 제시할 자신이 있습니다. 복잡한 문제에 직면했을 때에도 냉정하게 분석하고 빠르게 대응하는 능력을 갖췄습니다. 또한, 팀원들과의 원활한 커뮤니케이션을 통해 프로젝트의 성공을 이끌어내는데 기여할 것입니다. 최고의 결과물을 위해 끊임없이 노력하며, 스파르타코딩클럽에서도 이 같은 튼튼함을 발휘하여 뛰어난 성과를 이루고자 합니다.';

		const mockReturn = {
			...dummyResumes[+id],
			title,
			content
		}

		mockPrisma.resume.update.mockReturnValue(mockReturn);

		// WHEN
		const actualResult = await resumesRepository.updateResume(
			id,
			authorId,
			title,
			content
		);

		// THEN
		const expectedResult = mockReturn;

		expect(mockPrisma.resume.update).toHaveBeenCalledTimes(1);
		expect(mockPrisma.resume.update).toBeCalledWith({
			where: {
				id: +id,
				authorId
			},
			data: {
				title,
				content
			}
		});
		expect(actualResult).toEqual(expectedResult);
	});

	test('delete Method', async () => {
		// GIVEN
		const id = "1";
		const authorId = 1;

		const mockReturn = dummyResumes[+id];

		mockPrisma.resume.delete.mockReturnValue(mockReturn);
		// WHEN
		const actualResult = await resumesRepository.deleteResume(
			authorId,
			id
		);

		// THEN
		const expectedResult = mockReturn;

		expect(mockPrisma.resume.delete).toHaveBeenCalledTimes(1);
		expect(mockPrisma.resume.delete).toBeCalledWith({
			where: {
				id: +id,
				authorId
			},
		});
		expect(actualResult).toEqual(expectedResult);
	});
});
