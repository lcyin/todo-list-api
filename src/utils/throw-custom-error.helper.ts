import { ErrorCode } from "@/middleware/enums/error-code.enum";

export function mapDBErrorToAppError(error: any): Error {
  const appError = new Error("Database operation failed");
  (appError as any).type = ErrorCode.DATABASE_ERROR;
  (appError as any).originalError = error;
  return appError;
}
