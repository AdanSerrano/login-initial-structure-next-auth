import { MagicLinkService, RequestContext } from "../services/magic-link.services";
import { RequestMagicLinkInput } from "../validations/schema/magic-link.schema";

export class MagicLinkController {
  private service: MagicLinkService;

  constructor() {
    this.service = new MagicLinkService();
  }

  async requestMagicLink(input: RequestMagicLinkInput, context?: RequestContext) {
    return await this.service.requestMagicLink(input, context);
  }

  async verifyMagicLink(token: string, context?: RequestContext) {
    return await this.service.verifyMagicLink(token, context);
  }
}
