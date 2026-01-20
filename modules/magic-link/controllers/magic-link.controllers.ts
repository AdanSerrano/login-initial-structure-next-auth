import { MagicLinkService } from "../services/magic-link.services";
import { RequestMagicLinkInput } from "../validations/schema/magic-link.schema";

export class MagicLinkController {
  private service: MagicLinkService;

  constructor() {
    this.service = new MagicLinkService();
  }

  async requestMagicLink(input: RequestMagicLinkInput) {
    return await this.service.requestMagicLink(input);
  }

  async verifyMagicLink(token: string) {
    return await this.service.verifyMagicLink(token);
  }
}
