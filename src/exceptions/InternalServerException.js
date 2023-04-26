import { type } from "../constants/responseTypes";

export default class InternalServerException {
  constructor() {
    this.type = type.ERROR;
    this.message = "INTERNAL_SERVER_EXCEPTION";
    this.status = 500;
  }
}
