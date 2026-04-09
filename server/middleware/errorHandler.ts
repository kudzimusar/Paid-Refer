import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log everything
  console.error({
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    userId: (req as any).user?.id,
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      details: err.details,
    });
  }

  // Drizzle/Postgres errors
  if ((err as any).code === "23505") {
    return res.status(409).json({ error: "Duplicate entry" });
  }
  if ((err as any).code === "23503") {
    return res.status(400).json({ error: "Referenced record not found" });
  }

  // Default
  res.status(500).json({
    error: "Internal server error",
    requestId: req.headers["x-request-id"],
  });
}
