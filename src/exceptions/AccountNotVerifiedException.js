import { type } from "../utils/responseTypes";

export default class AccountNotVerifiedException {
  constructor() {
    this.type = type.ERROR;
    this.status = 401;
    this.message = "ACC_NOT_VERIFIED_EXCEPTION";
  }
}
