import multer from 'multer';
import multerS3 from 'multer-s3';
import { AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_ACCESS_KEY } from '../constants/env.constant.js';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
	accessKeyId: AWS_ACCESS_KEY,
	secretAccessKey: AWS_SECRET_ACCESS_KEY,
	region: AWS_REGION
});

const upload = multer({ storage: multer.memoryStorage() });


export { upload, s3 };