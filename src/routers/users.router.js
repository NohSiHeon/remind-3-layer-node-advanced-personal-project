import express from 'express';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { UsersController } from '../controllers/users.controller.js';

const usersRouter = express.Router();

const usersController = new UsersController();
usersRouter.get('/me', requireAccessToken, usersController.me);
export { usersRouter };
