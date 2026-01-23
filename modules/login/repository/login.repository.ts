import { db } from "@/utils/db";
import { LoginUser } from "../validations/schema/login.schema";

export class LoginRepository {
  public async getUserByIdentifier(loginUser: LoginUser) {
    try {
      if (!loginUser.identifier) {
        return null;
      }

      // Normalizar a minúsculas para búsqueda case-insensitive
      const normalizedIdentifier = loginUser.identifier.toLowerCase();

      if (normalizedIdentifier.includes("@")) {
        return await db.user.findUnique({
          where: { email: normalizedIdentifier },
        });
      }

      return await db.user.findUnique({
        where: { userName: normalizedIdentifier },
      });
    } catch (error) {
      console.error("Error en getUserByIdentifier:", error);
      return null;
    }
  }
}
