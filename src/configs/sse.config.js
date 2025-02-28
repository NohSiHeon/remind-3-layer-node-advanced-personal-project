import SSE from 'express-sse';

const sse = new SSE(null, {
	isSerialized: true,
	retry: 5000,
});

export { sse };