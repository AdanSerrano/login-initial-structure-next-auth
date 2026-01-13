import bcrypt from "bcryptjs";
import { RegisterRepository } from "../repository/register.repository";
import { RegisterUser } from "../validations/schema/register.schema";

export class RegisterService {
  private registerRepository: RegisterRepository;

  constructor() {
    this.registerRepository = new RegisterRepository();
  }

  public async register(registerData: RegisterUser) {
    try {
      // Verificar si el email ya existe
      const existingUserByEmail = await this.registerRepository.getUserByEmail(
        registerData.email
      );
      if (existingUserByEmail) {
        return { error: "El email ya está registrado" };
      }

      // Verificar si el username ya existe (si se proporcionó)
      if (registerData.userName) {
        const existingUserByUsername =
          await this.registerRepository.getUserByUsername(
            registerData.userName
          );
        if (existingUserByUsername) {
          return { error: "El nombre de usuario ya está en uso" };
        }
      }

      const hashedPassword = await bcrypt.hash(registerData.password, 10);

      const user = await this.registerRepository.createUser(
        registerData,
        hashedPassword
      );

      return { success: "Usuario registrado correctamente", user };
    } catch (error) {
      console.error("Error en register service:", error);
      return { error: "Error al registrar usuario" };
    }
  }
}
