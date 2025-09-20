import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { errorFormat } from "./transform-error-format.helper";
import { logFormat } from "./get-log-format.helper";

// Configure transports based on environment
export const getTransports = ({
  isTest,
  isDevelopment,
}: {
  isTest: boolean;
  isDevelopment: boolean;
}) => {
  const transports: winston.transport[] = [];
  if (isTest) {
    // In test environment, show detailed errors in console
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: "HH:mm:ss" }),
          errorFormat(),
          winston.format.printf((info) => {
            const { timestamp, level, message, ...meta } = info;
            let output = `${timestamp} ${level}: ${message}`;

            // Show detailed metadata including errors
            if (Object.keys(meta).length > 0) {
              output += "\n" + JSON.stringify(meta, null, 2);
            }

            return output;
          })
        ),
        level: "error", // Change to error level to see error logs
      })
    );
  } else {
    // Console transport for development
    if (isDevelopment) {
      transports.push(
        new winston.transports.Console({
          format: logFormat({
            isDevelopment,
            isTest,
          }),
        })
      );
    }

    // File transport for production and development
    // Ensure logs directory exists or handle gracefully
    try {
      transports.push(
        new DailyRotateFile({
          filename: "logs/app-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          maxFiles: "14d",
          maxSize: "20m",
          createSymlink: true,
          symlinkName: "app.log",
        })
      );
    } catch (error) {
      console.warn("Failed to create file transport:", error);
    }
  }

  return transports;
};
