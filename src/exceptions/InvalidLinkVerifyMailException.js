import { type } from "../utils/responseTypes";

export default class InvalidLinkVerifyMailException {
  constructor() {
    this.type = type.ERROR;
    this.status = 400;
    this.message = "INVALID_LINK_VERIFY_MAIL_EXCEPTION";
  }
}
