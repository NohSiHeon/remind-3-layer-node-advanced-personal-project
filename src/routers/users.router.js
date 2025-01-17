import express from 'express';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { UsersController } from '../controllers/users.controller.js';
import { upload } from '../middlewares/s3.middleware.js';
import { UserService } from '../services/users.service.js';
import { UserRepository } from '../repositories/users.repository.js';
import { prisma } from '../utils/prisma.util.js';

const usersRouter = express.Router();
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const usersController = new UsersController(userService);
usersRouter.get('/me', requireAccessToken, usersController.me);
usersRouter.patch('/profile', requireAccessToken, upload.single('image'), usersController.profile);
export { usersRouter };
