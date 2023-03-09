import { Router } from "express";
import AuthController from "../controllers/authController";

export default () => {
  const api = Router();

  //POST /register
  api.post("/register", AuthController.register);

  //POST /login
  api.post("/login", AuthController.login);

  //GET /logout
  api.get("/logout", AuthController.logout);

  //POST /refresh
  api.post("/refresh", AuthController.refreshToken);

  //GET /activate:id:token
  api.get("/activate/:id/:token", AuthController.activateAccount);

  return api;
};
