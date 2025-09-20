import winston from "winston";
import { errorFormat } from "./transform-error-format.helper";

// Custom format for logs
export const logFormat = ({
  isDevelopment,
  isTest,
}: {
  isDevelopment: boolean;
  isTest: boolean;
}) =>
  winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    errorFormat(),
    winston.format.colorize({ all: true }),
    isDevelopment || isTest
      ? winston.format.printf((info) => {
          const { timestamp, level, message, ...meta } = info;
          let output = `${timestamp} ${level}: ${message}`;

          if (Object.keys(meta).length > 0) {
            output += "\n" + JSON.stringify(meta, null, 2);
          }

          return output;
        })
      : winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
  );
