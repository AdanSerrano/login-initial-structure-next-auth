import { LoginUser } from "../validations/schema/login.schema";
import { LoginAuthService } from "./login.auth.service";
import { LoginDomainService } from "./login.domain.service";

export class LoginService {
  private loginDomainService: LoginDomainService;
  private loginAuthService: LoginAuthService;

  constructor() {
    this.loginDomainService = new LoginDomainService();
    this.loginAuthService = new LoginAuthService();
  }

  public async login(loginUser: LoginUser) {
    try {
      const domainValidation =
        await this.loginDomainService.validateLoginBusinessRules(loginUser);

      if (!domainValidation.isValid) {
        return {
          error: domainValidation.error,
          redirect: domainValidation.redirect,
        };
      }

      const identifier = domainValidation.identifier;
      if (!identifier) {
        return { error: "Error interno de validación" };
      }

      const authResult = await this.loginAuthService.authenticateUser(
        identifier,
        loginUser.password
      );

      return authResult;
    } catch (error) {
      console.error("Error en login service:", error);
      return { error: "Error al verificar credenciales" };
    }
  }
}
