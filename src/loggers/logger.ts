import envConfig from "../config/config";
import winston from "winston";
import { logColors } from "./consts/log-colors";
import { logLevels } from "./consts/log-levels";
import { getNodeEnv } from "./helpers/get-node-env.helper";
import { getLogLevel } from "./helpers/get-log-level.helper";
import { getTransports } from "./helpers/get-transports.helper";

// Environment-specific configuration
const { isDevelopment, isProduction, isTest } = getNodeEnv(envConfig);

winston.addColors(logColors);

// Create logger instance
const logger = winston.createLogger({
  level: getLogLevel({
    isTest,
    isProduction,
  }),
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    isTest ? winston.format.simple() : winston.format.json()
  ),
  defaultMeta: { service: "todo-api" },
  transports: getTransports({
    isTest,
    isDevelopment,
  }),
  // Only add exception/rejection handlers in non-test environments
  ...(isTest
    ? {}
    : {
        exceptionHandlers: [
          new winston.transports.File({ filename: "logs/exceptions.log" }),
        ],
        rejectionHandlers: [
          new winston.transports.File({ filename: "logs/rejections.log" }),
        ],
      }),
  silent: false, // Never silence in any environment for debugging
});

export default logger;
