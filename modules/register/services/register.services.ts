import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email/send-email";
import { RegisterRepository } from "../repository/register.repository";
import { RegisterUser } from "../validations/schema/register.schema";
import { RegisterDomainService } from "./register.domain.service";

export interface RegisterResult {
  success?: string;
  error?: string;
  requiresVerification?: boolean;
}

export class RegisterService {
  private registerRepository: RegisterRepository;
  private registerDomainService: RegisterDomainService;

  constructor() {
    this.registerRepository = new RegisterRepository();
    this.registerDomainService = new RegisterDomainService();
  }

  public async register(registerData: RegisterUser): Promise<RegisterResult> {
    try {
      const domainValidation =
        await this.registerDomainService.validateRegisterBusinessRules(
          registerData
        );

      if (!domainValidation.isValid) {
        return { error: domainValidation.error };
      }

      const hashedPassword = await bcrypt.hash(registerData.password, 10);
      await this.registerRepository.createUser(registerData, hashedPassword);

      const verificationToken = await generateVerificationToken(
        registerData.email
      );
      await sendVerificationEmail(registerData.email, verificationToken.token);

      return {
        success: "¡Cuenta creada! Revisa tu email para verificar tu cuenta.",
        requiresVerification: true,
      };
    } catch (error) {
      console.error("Error en register service:", error);
      return { error: "Error al registrar usuario" };
    }
  }
}
