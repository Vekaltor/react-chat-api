import { type } from "../constants/responseTypes";

class ForbiddenException {
  constructor() {
    this.type = type.ERROR;
    this.message = "FORBIDDEN_EXCEPTION";
    this.status = 403;
  }
}

export default ForbiddenException;
