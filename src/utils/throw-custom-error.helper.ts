import { ErrorCode } from "../middleware/enums/error-code.enum";

export function mapDBErrorToAppError(error: any, message: string): Error {
  const appError = new Error(message);
  (appError as any).type = ErrorCode.DATABASE_ERROR;
  (appError as any).originalError = error;
  return appError;
}
