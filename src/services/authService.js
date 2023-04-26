import UserService from "./userService";
import NodemailerService from "./nodemailerService";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { registerValidation, loginValidation } from "../utils/validation";

import ValidationException from "../exceptions/ValidationException";
import InternalServerException from "../exceptions/InternalServerException";
import LoginErrorException from "../exceptions/LoginErrorException";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import ForbiddenException from "../exceptions/ForbiddenException";
import AccountNotVerifiedException from "../exceptions/AccountNotVerifiedException";
import InvalidLinkVerifyMailException from "../exceptions/InvalidLinkVerifyMailException";
import { type } from "../constants/responseTypes";

class AuthService {
  #accessTokenExpiresIn = 86400;
  #refreshTokenExpiresIn = 525600;
  #userSerivce = new UserService();
  #nodemailerService = new NodemailerService();

  async login(req, res, next) {
    const { email, pass } = req.body;
    const { error } = loginValidation(req.body, req.t);
    const filter = { contact: { primary_email: email } };
    try {
      if (error) throw new ValidationException(error.details[0].message);
      this.#userSerivce.getUserByFilter(filter, async (err, user) => {
        try {
          if (err) throw new InternalServerException();
          if (!user) throw new LoginErrorException();

          const isValidPassword = await bcrypt.compare(pass, user.pass);
          if (!isValidPassword) throw new LoginErrorException();

          if (!user.details.is_verified)
            throw new AccountNotVerifiedException();

          const accessToken = this.#createToken(user._id);
          const refreshToken = this.#createToken(
            user._id,
            this.#refreshTokenExpiresIn
          );

          res
            .cookie("refreshToken", refreshToken, {
              maxAge: this.#refreshTokenExpiresIn * 1000,
              httpOnly: true,
              sameSite: "strict",
              secure: true,
              path: "/refresh",
            })
            .cookie("accessToken", accessToken, {
              maxAge: this.#accessTokenExpiresIn * 1000,
              sameSite: "strict",
              path: "/",
            });

          return res
            .status(200)
            .cookie(
              "user",
              JSON.stringify({
                id: user.id,
                name: user.name,
                surname: user.surname,
                details: user.details,
                contact: user.contact,
              })
            )
            .send({
              message: req.t("LOGIN_SUCCESS"),
              type: type.SUCCESS,
            });
        } catch (error) {
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  }

  logout = (req, res) => {
    try {
      res
        .clearCookie("refreshToken", { path: "/refresh" })
        .clearCookie("accessToken")
        .clearCookie("user")
        .status(200)
        .send({ message: "Logout Success", type: type.SUCCESS });
    } catch (error) {
      throw new InternalServerException();
    }
  };

  refreshToken = (req, res) => {
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) throw new UnauthorizedException();

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const userId = decoded.idUser;

      const newAccessToken = this.#createToken(userId);
      const newRefreshToken = this.#createToken(
        userId,
        this.#refreshTokenExpiresIn
      );

      res
        .cookie("refreshToken", newRefreshToken, {
          maxAge: this.#refreshTokenExpiresIn * 1000,
          httpOnly: true,
          sameSite: "strict",
          secure: true,
          path: "/refresh",
        })
        .cookie("accessToken", newAccessToken, {
          maxAge: this.#accessTokenExpiresIn * 1000,
          sameSite: "strict",
          path: "/",
        });

      return res.send({
        message: "Refreshed access token !",
      });
    } catch (error) {
      throw new ForbiddenException();
    }
  };

  register = async (req, res, next) => {
    const { body } = req;
    const { error } = registerValidation(body, req.t);
    try {
      if (error) throw new ValidationException(error.details[0].message);

      let user = await this.#userSerivce.addUser(body);
      let token = await this.#nodemailerService.createToken(user._id);

      const message = `<p>Thank you for registering int our application. Just one more steps ...</p><p>To activate your account please <b>follow</b> this link: </p><a target="_" href="${process.env.DOMAIN}/verify/${user._id}/${token.token}">Activate Link</a><p>Cheers,</p><p>Your application team</p>`;

      this.#nodemailerService.sendConfirmationEmail(
        body.email,
        "Activate account",
        message
      );

      return res.status(201).send({ message: req.t("REGISTER_SUCCESS") });
    } catch (error) {
      next(error);
    }
  };

  activateAccount = async (req, res, next) => {
    const { id, token } = req.params;
    try {
      const isUser = await this.#userSerivce.getUserById(id);
      if (!isUser) throw new InvalidLinkVerifyMailException();

      const isToken = await this.#nodemailerService.checkExistsToken(token);
      if (!isToken) throw new InvalidLinkVerifyMailException();

      await this.#userSerivce.modifyUser(id, {
        details: { is_verified: true },
      });
      await this.#nodemailerService.removeToken(id);

      res.status(200).send({
        message: req.t(
          `You have been succesfuly activated. You can login now!`
        ),
      });
    } catch (error) {
      next(error);
    }
  };

  #createToken = (idUser, expiresIn = this.#accessTokenExpiresIn) => {
    return jwt.sign(
      {
        idUser: idUser,
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );
  };
}

export default AuthService;
