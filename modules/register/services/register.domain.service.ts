import { RegisterRepository } from "../repository/register.repository";
import { RegisterValidationService } from "../validations/register.validation.service";
import { RegisterUser } from "../validations/schema/register.schema";

export interface DomainValidationResult {
  isValid: boolean;
  error?: string;
  data?: RegisterUser;
}

export class RegisterDomainService {
  private registerRepository: RegisterRepository;
  private registerValidationService: RegisterValidationService;

  constructor() {
    this.registerRepository = new RegisterRepository();
    this.registerValidationService = new RegisterValidationService();
  }

  public async validateRegisterBusinessRules(
    registerData: RegisterUser
  ): Promise<DomainValidationResult> {
    try {
      const validationResult =
        this.registerValidationService.validateInputData(registerData);

      if (!validationResult.isValid || !validationResult.data) {
        return {
          isValid: false,
          error: validationResult.error ?? "Campos inválidos",
        };
      }

      const existingUserByEmail = await this.registerRepository.getUserByEmail(
        registerData.email
      );
      if (existingUserByEmail) {
        return {
          isValid: false,
          error: "El email ya está registrado",
        };
      }

      if (registerData.userName) {
        const existingUserByUsername =
          await this.registerRepository.getUserByUsername(registerData.userName);
        if (existingUserByUsername) {
          return {
            isValid: false,
            error: "El nombre de usuario ya está en uso",
          };
        }
      }

      return {
        isValid: true,
        data: validationResult.data,
      };
    } catch (error) {
      console.error("Error in domain validation:", error);
      return {
        isValid: false,
        error: "Error al validar los datos",
      };
    }
  }
}
