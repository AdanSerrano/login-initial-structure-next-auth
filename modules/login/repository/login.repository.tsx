import { db } from "@/utils/db";
import { LoginUser } from "../validations/schema/login.schema";

export class LoginRepository {
  public async getUserByIdentifier(loginUser: LoginUser) {
    try {
      if (!loginUser.identifier) {
        return null;
      }

      if (loginUser.identifier.includes("@")) {
        return await db.user.findUnique({
          where: { email: loginUser.identifier },
        });
      }

      return await db.user.findUnique({
        where: { userName: loginUser.identifier },
      });
    } catch (error) {
      console.error("Error en getUserByIdentifier:", error);
      return null;
    }
  }
}
