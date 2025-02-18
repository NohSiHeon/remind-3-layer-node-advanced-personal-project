import express from 'express';
import { JobPostingController } from '../controllers/job-postings.controller.js';
import { prisma } from '../utils/prisma.util.js';
import { JobPostingService } from '../services/job-postings.service.js';
import { JobPostingRepository } from '../repositories/job-postings.repository.js';

const jobPostingRouter = express.Router();
const jobPostingRepository = new JobPostingRepository(prisma);
const jobPostingService = new JobPostingService(jobPostingRepository);
const jobPostingController = new JobPostingController(jobPostingService);

jobPostingRouter.post('/', jobPostingController.createJobPosting);
jobPostingRouter.get('/:id', jobPostingController.getJobPosting);
jobPostingRouter.get('/', jobPostingController.getJobPostings);
jobPostingRouter.patch('/:id', jobPostingController.updateJobPosting);
jobPostingRouter.delete('/:id', jobPostingController.deleteJobPosting);

export { jobPostingRouter };