import tryCatch from "../utils/tryCatch";
import UserService from "../services/userService";

class UserController {
  constructor() {
    this.service = new UserService();
  }
  getAllUsers = (req, res, next) => {
    tryCatch(this.service.getAllUsers(req, res, next));
  };
}

export default new UserController();
