import express from 'express';
import { authRouter } from './auth.router.js';
import { usersRouter } from './users.router.js';
import { resumesRouter } from './resumes.router.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { jobPostingRouter } from './job-postings.router.js';
import { appliesRouter } from './applies.router.js';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/resumes', requireAccessToken, resumesRouter);
apiRouter.use('/jobPostings', requireAccessToken, jobPostingRouter);
apiRouter.use('/applies', requireAccessToken, appliesRouter);

export { apiRouter };
