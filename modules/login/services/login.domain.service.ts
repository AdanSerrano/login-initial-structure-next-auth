import { LoginRepository } from "../repository/login.repository";
import { LoginUser } from "../validations/schema/login.schema";
import { LoginPasswordService } from "./login.password.service";
import { LoginValidationService } from "./login.validation.service";

export interface DomainValidationResult {
  isValid: boolean;
  error?: string;
  redirect?: boolean;
  user?: any;
  identifier?: string;
}

export class LoginDomainService {
  private loginRepository: LoginRepository;
  private loginValidationService: LoginValidationService;
  private loginPasswordService: LoginPasswordService;

  constructor() {
    this.loginRepository = new LoginRepository();
    this.loginValidationService = new LoginValidationService();
    this.loginPasswordService = new LoginPasswordService();
  }

  public async validateLoginBusinessRules(
    loginUser: LoginUser
  ): Promise<DomainValidationResult> {
    try {
      const validationResult =
        this.loginValidationService.validateInputData(loginUser);

      if (!validationResult.isValid || !validationResult.data) {
        return {
          isValid: false,
          error: validationResult.error ?? "Campos inválidos",
        };
      }

      const { identifier, password } = validationResult.data;

      const user = await this.loginRepository.getUserByIdentifier(loginUser);
      if (!user) {
        return {
          isValid: false,
          error: "Usuario no encontrado",
        };
      }

      if (!user.email || !user.password) {
        return {
          isValid: false,
          error: "Usuario no tiene email o contraseña configurada",
        };
      }

      const passwordMatch = await this.loginPasswordService.comparePassword(
        password,
        user.password
      );
      if (!passwordMatch) {
        return {
          isValid: false,
          error: "Contraseña incorrecta",
        };
      }

      if (!user.emailVerified) {
        return {
          isValid: false,
          error: "Usuario no verificado",
          redirect: false,
        };
      }

      return {
        isValid: true,
        user,
        identifier,
      };
    } catch (error) {
      console.error("Error in domain validation:", error);
      return {
        isValid: false,
        error: "Error al validar credenciales",
      };
    }
  }
}
