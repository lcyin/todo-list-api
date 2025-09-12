import { hashPassword, verifyPassword } from "./user.component";

describe("@users.component", () => {
  describe("verifyPassword", () => {
    it("should return true for correct password", async () => {
      const password = "Password@123";
      const hashedPassword = await hashPassword(password);
      const isMatch = await verifyPassword(password, hashedPassword);
      expect(isMatch).toBe(true);
    });
  });
});
