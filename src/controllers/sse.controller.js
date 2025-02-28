import { sse } from "../configs/sse.config.js";

class SseController {
	getEvent = async (req, res, next) => {
		try {
			sse.init(req, res);

		} catch (error) {
			next(error);
		}
	}
}

export { SseController };