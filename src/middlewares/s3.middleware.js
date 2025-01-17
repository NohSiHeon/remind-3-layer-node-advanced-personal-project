import multer from 'multer';
import multerS3 from 'multer-s3';
import { AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_ACCESS_KEY } from '../constants/env.constant.js';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
	accessKeyId: AWS_ACCESS_KEY,
	secretAccessKey: AWS_SECRET_ACCESS_KEY,
	region: AWS_REGION
});

const upload = multer({
	storage: multerS3({
		s3,
		bucket: 'nsh-s3-bucket', // S3 버킷 이름
		acl: 'public-read',  // 파일을 public-read로 설정하여 URL로 접근 가능
		key: (req, file, cb) => {
			const fileName = `uploads/${Date.now()}-${file.originalname}`;
			cb(null, fileName);  // S3에 저장될 파일 이름 지정
		},
	}),
});


export { upload };