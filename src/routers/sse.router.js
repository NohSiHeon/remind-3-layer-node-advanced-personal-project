import express from 'express';
import { SseController } from '../controllers/sse.controller.js';

const sseController = new SseController();
const sseRouter = express.Router();

sseRouter.get('/', sseController.getEvent);

export { sseRouter };