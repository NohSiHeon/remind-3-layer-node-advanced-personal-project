import express from 'express';
import { SERVER_PORT, SESSION_SECRET } from './constants/env.constant.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { HTTP_STATUS } from './constants/http-status.constant.js';
import { apiRouter } from './routers/index.js';
import session from 'express-session';
import { connectRedis } from './configs/redis.config.js';
import cors from 'cors';

const app = express();
connectRedis();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
	origin: 'http://127.0.0.1:5500', // Live Server 주소
	methods: ['GET', 'POST', 'PATCH'], // 허용할 HTTP 메서드
	credentials: true // 쿠키, 인증정보 필요시 true
}));

app.use(session({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}));

app.get('/health-check', (req, res) => {
	return res.status(HTTP_STATUS.OK).send(`I'm healthy.`);
});

app.use('/api', apiRouter);

app.use(errorHandler);

app.listen(SERVER_PORT, () => {
	console.log(`서버가 ${SERVER_PORT}번 포트에서 실행 중입니다.`);
});
