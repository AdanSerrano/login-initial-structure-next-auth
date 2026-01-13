import { LoginService } from "../services/login.services";
import { LoginUser } from "../validations/schema/login.schema";

export class LoginController {
  private loginService: LoginService;

  constructor() {
    this.loginService = new LoginService();
  }

  public async handleLogin(loginUser: LoginUser) {
    return await this.loginService.login(loginUser);
  }
}
