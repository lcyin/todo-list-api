import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

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
const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";
const isDevelopment =
  process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
console.log("Logger initialized in", process.env.NODE_ENV, "mode", {
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
    // In test environment, only log errors and only to console (optional)
    transports.push(
      new winston.transports.Console({
        format: winston.format.simple(),
        level: "error", // Only show errors in tests
      })
    );
    // Don't add file transports in test environment
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
    transports.push(
      new DailyRotateFile({
        filename: "logs/app-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        maxFiles: "14d",
        maxSize: "20m",
      })
    );
  }

  return transports;
};

// Get log level based on environment
const getLogLevel = () => {
  if (isTest) return "error"; // Only log errors in tests
  if (isProduction) return "http";
  return "debug"; // Development
};
const transports = getTransports();
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
  silent: isTest && process.env.JEST_VERBOSE !== "true", // Silent in tests unless verbose
});

export default logger;
