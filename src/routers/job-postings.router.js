import express from 'express';
import { JobPostingController } from '../controllers/job-postings.controller.js';
import { prisma } from '../utils/prisma.util.js';
import { JobPostingService } from '../services/job-postings.service.js';
import { JobPostingRepository } from '../repositories/job-postings.repository.js';
import { checkRecruiterRoleMiddleware } from '../middlewares/check-recruiter-role.middleware.js';

const jobPostingRouter = express.Router();
const jobPostingRepository = new JobPostingRepository(prisma);
const jobPostingService = new JobPostingService(jobPostingRepository);
const jobPostingController = new JobPostingController(jobPostingService);

jobPostingRouter.post('/', checkRecruiterRoleMiddleware, jobPostingController.createJobPosting);
jobPostingRouter.get('/:id', jobPostingController.getJobPosting);
jobPostingRouter.get('/', jobPostingController.getJobPostings);
jobPostingRouter.patch('/:id', checkRecruiterRoleMiddleware, jobPostingController.updateJobPosting);
jobPostingRouter.delete('/:id', checkRecruiterRoleMiddleware, jobPostingController.deleteJobPosting);

export { jobPostingRouter };