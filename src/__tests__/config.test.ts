import { config } from "../config";

describe("Configuration", () => {
  it("should load default configuration", () => {
    expect(config.server.port).toBe(3000);
    expect(config.api.version).toBe("v1");
    expect(config.api.prefix).toBe("/api");
  });

  it("should determine environment correctly", () => {
    expect(typeof config.isDevelopment).toBe("boolean");
    expect(typeof config.isProduction).toBe("boolean");
  });
});
