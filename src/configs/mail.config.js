import nodemailer from 'nodemailer';
import { NODE_MAILER_PASS, NODE_MAILER_SERVICE, NODE_MAILER_USER } from '../constants/env.constant.js';

const transporter = nodemailer.createTransport({
	service: NODE_MAILER_SERVICE,
	auth: {
		user: NODE_MAILER_USER,
		pass: NODE_MAILER_PASS
	}
});


export { transporter };