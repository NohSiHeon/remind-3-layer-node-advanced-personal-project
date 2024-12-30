import express from 'express';
import { createResumeValidator } from '../middlewares/validators/create-resume-validator.middleware.js';
import { prisma } from '../utils/prisma.util.js';
import { updateResumeValidator } from '../middlewares/validators/update-resume-validator.middleware.js';
import { ResumeController } from '../controllers/resumes.controller.js';
import { ResumeService } from '../services/resumes.service.js';
import { ResumesRepository } from '../repositories/resumes.repository.js';


const resumeRepository = new ResumesRepository(prisma);
const resumeService = new ResumeService(resumeRepository);
const resumeController = new ResumeController(resumeService);
const resumesRouter = express.Router();

resumesRouter.post('/', createResumeValidator, resumeController.createResume);
resumesRouter.get('/', resumeController.getResumes);
resumesRouter.get('/:id', resumeController.getResume);
resumesRouter.put('/:id', updateResumeValidator, resumeController.updateResume);
resumesRouter.delete('/:id', resumeController.deleteResume);


export { resumesRouter };
