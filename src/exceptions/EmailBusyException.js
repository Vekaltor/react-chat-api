import { type } from "../utils/responseTypes";

class EmailBusyException {
  constructor() {
    this.type = type.WARNING;
    this.status = 409;
    this.message = "EMAIL_EXISTS";
  }
}

export default EmailBusyException;
