import { type } from "../constants/responseTypes";

class UnauthorizedException {
  constructor() {
    this.type = type.ERROR;
    this.message = "UNAUTHORIZED_EXCEPTION";
    this.status = 401;
  }
}

export default UnauthorizedException;
