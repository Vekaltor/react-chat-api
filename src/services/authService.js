import User from "../model/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserService from "./userService";
import { registerValidation, loginValidation } from "../utils/validation";
import ValidationException from "../exceptions/ValidationException";

class AuthService {
  constructor() {
    this.userService = new UserService();
  }

  async login(req, res, next) {
    const { email, pass } = req.body;
    const { error } = loginValidation(req.body, req.t);

    try {
      if (error) throw new ValidationException(error.details[0].message);
      User.findOne({ email: email }).exec((err, user) => {
        if (err) {
          return res.status(500).send({ message: req.t("ERR_CODE_500") });
        }
        if (!user) {
          return res.status(401).send({ message: req.t("Unauthorized") });
        }
        const isValidPassword = bcrypt.compare(pass, user.pass);
        if (!isValidPassword) {
          return res
            .status(401)
            .send({ accessToken: null, message: "Unauthorized" });
        }
        const token = this.createJWT(user);

        res.status(200).send({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            surname: user.surname,
          },
          message: req.t("LOGIN_SUCCESS"),
          accessToken: token,
        });
      });
    } catch (error) {
      next(error);
    }
  }

  register = async (req, res, next) => {
    const { body } = req;
    const { error } = registerValidation(req.body, req.t);

    try {
      if (error) throw new ValidationException(error.details[0].message);
      await this.userService.create(body);
      return res.status(201).send({ message: req.t("REGISTER_SUCCESS") });
    } catch (error) {
      next(error);
    }
  };

  createJWT = (user) => {
    return jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: 86400 }
    );
  };
}

export default AuthService;
