import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { ApiResponse } from "../types/todo-route";
import { ErrorDetails } from "./interfaces/errore-interface";
import { ErrorCode } from "./enums/error-code.enum";

function handleZodError(error: ZodError) {
  const details: ErrorDetails[] = error.issues.map((issue) => ({
    field: issue.path.join("."),
    value: issue.input,
    constraint: issue.code,
    code: issue.message,
  }));

  const message = error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");
  return {
    message: `Validation failed: ${message}`,
    details,
    type: ErrorCode.VALIDATION_ERROR,
    stack: error.stack,
  };
}

// Generic validation middleware factory
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate the request object (params, body, query)
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodErrorDetails = handleZodError(error);
        next(zodErrorDetails);
        // res.status(400).json(response);
        return;
      }

      next(error);
      return;
    }
  };
};

// Specific validation middlewares for common use cases
export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodErrorDetails = handleZodError(error);
        next(zodErrorDetails);
        return;
      }

      next(error);
      return;
    }
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodErrorDetails = handleZodError(error);
        next(zodErrorDetails);
        return;
      }

      next(error);
      return;
    }
  };
};
