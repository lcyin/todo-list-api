import { EnvironmentConfig } from "../../config/config";

export const getNodeEnv = ({ nodeEnv }: EnvironmentConfig) => {
  const isDevelopment = nodeEnv === "development";
  const isProduction = nodeEnv === "production";
  const isTest = nodeEnv === "test";
  console.log("Logger initialized in", nodeEnv, "mode", {
    isDevelopment,
    isProduction,
    isTest,
  });
  return {
    isDevelopment,
    isProduction,
    isTest,
  };
};
