import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { loadEnvironmentConfig } from "./environment";

// Load environment configuration
const env = loadEnvironmentConfig();

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for log levels
const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(logColors);

// Environment-specific configuration
const isProduction = env.nodeEnv === "production";
const isTest = env.nodeEnv === "test";
const isDevelopment =
  env.nodeEnv === "development" || !env.nodeEnv;
console.log("Logger initialized in", env.nodeEnv, "mode", {
  isDevelopment,
  isProduction,
  isTest,
});

// Custom format for logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  isDevelopment
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

// Configure transports based on environment
const getTransports = () => {
  const transports: winston.transport[] = [];
  if (isTest) {
    // In test environment, only use console transport with simple format
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: "HH:mm:ss" }),
          winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
        ),
        level: "info", // Show info and above in tests for migration visibility
      })
    );
  } else {
    // Console transport for development
    if (isDevelopment) {
      transports.push(
        new winston.transports.Console({
          format: logFormat,
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

// Get log level based on environment
const getLogLevel = () => {
  if (isTest) return "info"; // Show info and above in tests for migration visibility
  if (isProduction) return "http";
  return "debug"; // Development
};
// Create logger instance
const logger = winston.createLogger({
  level: getLogLevel(),
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    isTest ? winston.format.simple() : winston.format.json()
  ),
  defaultMeta: { service: "todo-api" },
  transports: getTransports(),
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
