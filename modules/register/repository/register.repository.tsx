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
      return await db.user.findUnique({
        where: { email },
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
      return await db.user.findUnique({
        where: { userName },
      });
    } catch (error) {
      console.error("Error en getUserByUsername:", error);
      return null;
    }
  }

  public async createUser(registerData: RegisterUser, hashedPassword: string) {
    try {
      return await db.user.create({
        data: {
          email: registerData.email,
          userName: registerData.userName,
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
