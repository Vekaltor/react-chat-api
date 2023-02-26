import { Router } from "express";
import AuthController from "../controllers/authController";

export default () => {
  const api = Router();

  //POST /register
  api.post("/register", AuthController.register);

  //POST /login
  api.post("/login", AuthController.login);

  api.post("/refresh", AuthController.refreshToken);

  return api;
};
