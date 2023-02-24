import { Router } from "express";
import AuthController from "../controllers/authController";
import tryCatch from "../utils/tryCatch";

export default () => {
  const api = Router();

  //POST /register
  api.post("/register", AuthController.register);

  //POST /login
  api.post("/login", AuthController.login);

  return api;
};
