import { db } from "@/utils/db";

export class ForgotPasswordRepository {
  public async getUserByEmail(email: string) {
    // Normalizar a minúsculas para búsqueda case-insensitive
    return await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }
}
