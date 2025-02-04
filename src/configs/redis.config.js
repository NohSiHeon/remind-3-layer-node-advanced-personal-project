import { createClient } from "redis";
import { REDIS_HOSTNAME, REDIS_PASSWORD, REDIS_PORT, REDIS_USERNAME } from "../constants/env.constant.js";


const redisClient = createClient({
	url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOSTNAME}:${REDIS_PORT}`
});

redisClient.on("connect", () => {
	console.log("✅ Redis 연결 성공!");
});

redisClient.on("error", (err) => {
	console.error("❌ Redis Client Error:", err);
});

const connectRedis = async () => {
	try {
		await redisClient.connect();
		console.log("🚀 Redis 연결 완료!");
	} catch (error) {
		console.error("❌ Redis 연결 실패:", error);
	}
}

export { redisClient, connectRedis };