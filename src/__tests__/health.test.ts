import request from "supertest";
import app from "../app";

describe("Health Check Endpoints", () => {
  describe("GET /health", () => {
    it("should return 200 and health status", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body).toHaveProperty("status", "healthy");
      expect(response.body).toHaveProperty("timestamp");
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("GET /api/v1/health", () => {
    it("should return 200 and detailed health status", async () => {
      const response = await request(app).get("/api/v1/health").expect(200);

      expect(response.body).toHaveProperty("status", "healthy");
      expect(response.body).toHaveProperty("timestamp");
      expect(response.body).toHaveProperty("version");
      expect(response.body).toHaveProperty("environment");
      expect(response.body).toHaveProperty("uptime");
    });
  });

  describe("GET /api/v1/health/readiness", () => {
    it("should return 200 for readiness probe", async () => {
      const response = await request(app)
        .get("/api/v1/health/readiness")
        .expect(200);

      expect(response.body).toHaveProperty("status", "healthy");
    });
  });

  describe("GET /api/v1/health/liveness", () => {
    it("should return 200 for liveness probe", async () => {
      const response = await request(app)
        .get("/api/v1/health/liveness")
        .expect(200);

      expect(response.body).toHaveProperty("status", "healthy");
    });
  });
});
