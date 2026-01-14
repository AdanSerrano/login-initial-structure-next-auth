import bcrypt from "bcryptjs";

export class LoginPasswordService {
  public async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error("Error comparing passwords:", error);
      return false;
    }
  }
}
