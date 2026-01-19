import { LoginRepository } from "../repository/login.repository";
import { LoginValidationService } from "../validations/login.validation.service";
import { LoginUser } from "../validations/schema/login.schema";

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

  constructor() {
    this.loginRepository = new LoginRepository();
    this.loginValidationService = new LoginValidationService();
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

      const { identifier } = validationResult.data;
      const user = await this.loginRepository.getUserByIdentifier(loginUser);

      if (!user || !user.email || !user.password) {
        return {
          isValid: false,
          error: "Credenciales inválidas",
        };
      }

      if (!user.emailVerified) {
        return {
          isValid: false,
          error:
            "Tu cuenta aún no está verificada. Revisa tu email para activarla.",
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
        error: "Error al verificar credenciales",
      };
    }
  }
}
