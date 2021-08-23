
import boom from "@hapi/boom"
import type { NextFunction, Request, Response } from "express"
import pino from "pino"

import { logger } from "./logger"

export const handle = pino.final(logger, (err, finalLogger) => {
  finalLogger.fatal(err);
  process.exitCode = 1;
  process.kill(process.pid, "SIGTERM");
});

export const notFoundMiddleware = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  next(boom.notFound("The requested resource does not exist."));
};

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const {
    output: { payload: error, statusCode },
  } = boom.boomify(err);

  res.status(statusCode).json({ error });
  if (statusCode >= 500) {
    handle(err);
  }
};

