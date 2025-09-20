// Get log level based on environment
export const getLogLevel = ({
  isTest,
  isProduction,
}: {
  isTest: boolean;
  isProduction: boolean;
}) => {
  if (isTest) return "error"; // Show errors in tests for debugging
  if (isProduction) return "http";
  return "debug"; // Development
};
