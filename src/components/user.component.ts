import logger from "../config/logger";
import bcrypt from "bcryptjs";

/**
 * Verify user password
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    logger.error("Error verifying password:", error);
    return false;
  }
}
