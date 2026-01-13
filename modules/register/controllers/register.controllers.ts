import { RegisterService } from "../services/register.services";
import { RegisterUser } from "../validations/schema/register.schema";

export class RegisterController {
  private registerService: RegisterService;

  constructor() {
    this.registerService = new RegisterService();
  }

  public async register(registerData: RegisterUser) {
    return await this.registerService.register(registerData);
  }
}
