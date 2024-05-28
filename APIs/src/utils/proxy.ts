import { Request, Response, NextFunction } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { ClientRequest } from "http";

interface CustomOptions extends Options {
	onProxyReq?: (proxyReq: ClientRequest, req: Request, res: Response) => void;
}

export const proxyRequest = (
	target: string,
	pathRewrite: Record<string, string>
) => {
	const options: CustomOptions = {
		target,
		changeOrigin: true,
		pathRewrite,
		onProxyReq: (proxyReq: ClientRequest, req: Request, res: Response) => {
			if (req.body) {
				const bodyData = JSON.stringify(req.body);
				proxyReq.setHeader("Content-Type", "application/json");
				proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
				proxyReq.write(bodyData);
				proxyReq.end();
			}
		},
	};

	return createProxyMiddleware(options);
};
