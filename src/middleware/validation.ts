import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { ApiResponse } from "../types/todo-route";

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
        const errorMessages = error.issues.map((err: any) => {
          const path = err.path.join(".");
          return `${path}: ${err.message}`;
        });

        const response: ApiResponse<null> = {
          success: false,
          error: `Validation failed: ${errorMessages.join(", ")}`,
        };

        res.status(400).json(response);
        return;
      }

      // Handle unexpected errors
      const response: ApiResponse<null> = {
        success: false,
        error: "Internal validation error",
      };

      res.status(500).json(response);
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
        const errorMessages = error.issues.map((err: any) => {
          const path = err.path.join(".");
          return `${path}: ${err.message}`;
        });

        const response: ApiResponse<null> = {
          success: false,
          error: `Validation failed: ${errorMessages.join(", ")}`,
        };

        res.status(400).json(response);
        return;
      }

      const response: ApiResponse<null> = {
        success: false,
        error: "Internal validation error",
      };

      res.status(500).json(response);
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
        const errorMessages = error.issues.map((err: any) => {
          const path = err.path.join(".");
          return `${path}: ${err.message}`;
        });

        const response: ApiResponse<null> = {
          success: false,
          error: `Validation failed: ${errorMessages.join(", ")}`,
        };

        res.status(400).json(response);
        return;
      }

      const response: ApiResponse<null> = {
        success: false,
        error: "Internal validation error",
      };

      res.status(500).json(response);
    }
  };
};
