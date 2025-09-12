import { hashPassword, verifyPassword } from "./users.component";

describe("@users.component", () => {
  describe("verifyPassword", () => {
    it("should return true for correct password", async () => {
      const password = "Password@123";
      const hashedPassword = await hashPassword(password);
      const isMatch = await verifyPassword(password, hashedPassword);
      expect(isMatch).toBe(true);
    });
    describe("should return false for incorrect password", () => {
      it("when password is wrong", async () => {
        const password = "Password@123";
        const wrongPassword = "WrongPassword@123";
        const hashedPassword = await hashPassword(password);
        const isMatch = await verifyPassword(wrongPassword, hashedPassword);
        expect(isMatch).toBe(false);
      });
    });
  });
  describe("hashPassword", () => {
    it("should hash the password correctly", async () => {
      const password = "Password@123";
      const hashedPassword = await hashPassword(password);
      const data = {
        hashPassword: await hashPassword(password),
        isMatch: await verifyPassword(password, hashedPassword),
      };
      expect(data).toEqual({
        hashPassword: expect.stringMatching(/^\$2[ayb]\$.{56}$/),
        isMatch: true,
      });
    });
  });
});
