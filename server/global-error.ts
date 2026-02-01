import { type NextFunction, type Request, type Response } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(`[${req.method}] ${req.url} >> Error:`, err);

  const statusCode = err?.status || err?.statusCode || 500;

  const message = err?.message || "Internal Server Error";

  res.status(statusCode).json({
    error: message,
    path: req.url,
  });
};
