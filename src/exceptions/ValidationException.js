import { type } from "../utils/responseTypes";

class ValidationException {
  constructor(message) {
    this.type = type.ERROR;
    this.status = 406;
    this.message = message;
  }
}
export default ValidationException;
