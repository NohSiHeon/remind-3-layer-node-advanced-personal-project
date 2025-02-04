import express from 'express';
import { signUpValidator } from '../middlewares/validators/sign-up-validator.middleware.js';
import { signInValidator } from '../middlewares/validators/sign-in-validator.middleware.js';
import { prisma } from '../utils/prisma.util.js';

import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '../services/auth.service.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import { redisClient } from '../configs/redis.config.js';
import { requireRefreshToken } from '../middlewares/require-refresh-token.middleware.js';

const authRouter = express.Router();
const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository, redisClient);
const authController = new AuthController(authService);

authRouter.post('/sign-up', signUpValidator, authController.signUp);
authRouter.post('/sign-in', signInValidator, authController.signIn);
authRouter.delete('/log-out', requireRefreshToken, authController.logOut);
authRouter.get('/naver', authController.naverLogin);
authRouter.get('/naver/callback', authController.naverLoginCallback);




export { authRouter };
