import { db } from "@/utils/db";
import { RegisterUser } from "../validations/schema/register.schema";

interface RegisterData {
  email: string;
  password: string;
  userName?: string;
  name?: string;
  confirmPassword: string;
}

export class RegisterRepository {
  public async getUserByEmail(email: string) {
    try {
      if (!email) {
        return null;
      }
      // Normalizar a minúsculas para búsqueda case-insensitive
      return await db.user.findUnique({
        where: { email: email.toLowerCase() },
      });
    } catch (error) {
      console.error("Error en getUserByEmail:", error);
      return null;
    }
  }

  public async getUserByUsername(userName: string) {
    try {
      if (!userName) {
        return null;
      }
      // Normalizar a minúsculas para búsqueda case-insensitive
      return await db.user.findUnique({
        where: { userName: userName.toLowerCase() },
      });
    } catch (error) {
      console.error("Error en getUserByUsername:", error);
      return null;
    }
  }

  public async createUser(registerData: RegisterUser, hashedPassword: string) {
    try {
      // Normalizar email y username a minúsculas al guardar
      return await db.user.create({
        data: {
          email: registerData.email.toLowerCase(),
          userName: registerData.userName?.toLowerCase(),
          name: registerData.name,
          password: hashedPassword,
        },
      });
    } catch (error) {
      console.error("Error en createUser:", error);
      throw error;
    }
  }
}
