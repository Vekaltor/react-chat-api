import { type } from "../utils/responseTypes";

class ForbiddenException {
  constructor() {
    this.type = type.ERROR;
    this.message = "FORBIDDEN_EXCEPTION";
    this.status = 403;
  }
}

export default ForbiddenException;
