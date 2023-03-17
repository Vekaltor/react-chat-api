import { type } from "../utils/responseTypes";

export default class FriendshipExistsException {
  constructor() {
    this.type = type.ERROR;
    this.status = 409;
    this.message = "FRIENDSHIP_EXISTS_EXCEPTION";
  }
}
