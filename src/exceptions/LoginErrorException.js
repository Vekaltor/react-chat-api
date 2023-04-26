import { type } from "../constants/responseTypes";

export default class LoginErrorException {
  constructor() {
    this.type = type.ERROR;
    this.status = 401;
    this.message = "ERR_INVALID_LOGIN";
  }
}
