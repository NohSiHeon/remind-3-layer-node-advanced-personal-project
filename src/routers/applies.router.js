import express from 'express';
import { ApplyController } from '../controllers/applies.controller.js';
import { ApplyService } from '../services/applies.service.js';
import { ApplyRepository } from '../repositories/applies.repository.js';
import { prisma } from '../utils/prisma.util.js';
import { ResumesRepository } from '../repositories/resumes.repository.js';
import { JobPostingRepository } from '../repositories/job-postings.repository.js';
import { checkApplicantRoleMiddleware } from '../middlewares/check-applicant-role.middleware.js';


const resumeRepository = new ResumesRepository(prisma);
const jobPostingRepository = new JobPostingRepository(prisma);
const applyRepository = new ApplyRepository(prisma, jobPostingRepository);
const applyService = new ApplyService(applyRepository, resumeRepository, jobPostingRepository);
const applyController = new ApplyController(applyService);

const appliesRouter = express.Router();

appliesRouter.post('/', checkApplicantRoleMiddleware, applyController.applyJobPosting);
appliesRouter.get('/', applyController.getApplies);
// appliesRouter.get('/:id', applyController.getApply);
// appliesRouter.patch('/:id', applyController.updateStatus);
// appliesRouter.delete('/:id', applyController.cancelApply)

export { appliesRouter };