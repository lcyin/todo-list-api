import winston from "winston";

export const transformErrorFormat = (
  info: winston.Logform.TransformableInfo
) => {
  if (info instanceof Error) {
    return {
      ...info,
      message: info.message,
      stack: info.stack,
    };
  }

  // Handle error objects in metadata
  if (info.error) {
    if (info.error instanceof Error) {
      info.error = {
        message: info.error.message,
        stack: info.error.stack,
        code: (info.error as any).code,
        detail: (info.error as any).detail,
        hint: (info.error as any).hint,
      };
    }
  }

  return info;
};

export const errorFormat = winston.format(transformErrorFormat);
