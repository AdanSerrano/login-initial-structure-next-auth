import { TwoFactorService } from "../services/two-factor.services";
import { TwoFactorInput, SendTwoFactorInput } from "../validations/schema/two-factor.schema";

export class TwoFactorController {
  private service: TwoFactorService;

  constructor() {
    this.service = new TwoFactorService();
  }

  public async sendCode(input: SendTwoFactorInput) {
    return await this.service.sendTwoFactorCode(input);
  }

  public async verifyCode(input: TwoFactorInput) {
    return await this.service.verifyTwoFactorCode(input);
  }

  public async toggle(userId: string, enable: boolean) {
    return await this.service.toggleTwoFactor(userId, enable);
  }
}
