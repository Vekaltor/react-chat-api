import tryCatch from "../utils/tryCatch";
import AuthService from "../services/authService";

class AuthController {
  constructor() {
    this.service = new AuthService();
  }

  login = (req, res, next) => {
    tryCatch(this.service.login(req, res, next));
  };

  register = (req, res, next) => {
    tryCatch(this.service.register(req, res, next));
  };

  refreshToken = (req, res, next) => {
    tryCatch(this.service.refreshToken(req, res, next));
  };
}

export default new AuthController();
