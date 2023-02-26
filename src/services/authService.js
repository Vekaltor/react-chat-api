import User from "../model/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserService from "./userService";
import { registerValidation, loginValidation } from "../utils/validation";
import ValidationException from "../exceptions/ValidationException";
import InternalServerException from "../exceptions/InternalServerException";
import LoginErrorException from "../exceptions/LoginErrorException";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import ForbiddenException from "../exceptions/ForbiddenException";
class AuthService {
  constructor() {
    this.userService = new UserService();
    this.tokenExpiresIn = 86400;
  }

  async login(req, res, next) {
    const { email, pass } = req.body;
    const { error } = loginValidation(req.body, req.t);

    try {
      if (error) throw new ValidationException(error.details[0].message);
      User.findOne({ email: email }).exec(async (err, user) => {
        try {
          if (err) throw new InternalServerException();
          if (!user) throw new LoginErrorException();

          const isValidPassword = await bcrypt.compare(pass, user.pass);
          if (!isValidPassword) throw new LoginErrorException();

          const accessToken = this.#createToken(user, 10);
          const refreshToken = this.#createToken(user, 525600);

          this.userService.modifyUser(user.id, {
            refreshToken: refreshToken,
          });

          res.cookie("JWT", accessToken, {
            maxAge: this.tokenExpiresIn * 1000,
            httpOnly: true,
          });

          return res.status(200).send({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              surname: user.surname,
            },
            message: req.t("LOGIN_SUCCESS"),
          });
        } catch (error) {
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  }

  refreshToken = (req, res) => {
    const refreshToken = req.body.accessToken;
    const user = req.body.user;

    if (!refreshToken) throw new UnauthorizedException();

    try {
      jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
      throw new ForbiddenException();
    }

    const accessToken = this.#createToken(user);
    return res.send({ accessToken });
  };

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

  #createToken = (user, expiresIn = this.tokenExpiresIn) => {
    return jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );
  };
}

export default AuthService;
