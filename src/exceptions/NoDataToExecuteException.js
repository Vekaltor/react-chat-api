import { type } from "../constants/responseTypes";

class NoDataToExecuteException {
  constructor() {
    this.type = type.ERROR;
    this.status = 406;
    this.message = "NO_DATA_TO_EXECUTE";
  }
}

export default NoDataToExecuteException;
