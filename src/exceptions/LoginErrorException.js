export default class LoginErrorException {
  constructor() {
    this.status = 401;
    this.message = "ERR_INVALID_LOGIN";
  }
}
