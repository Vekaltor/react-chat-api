import express from "express";
import verifyToken from "../middlewares/verifyToken";
import UserController from "../controllers/userController";

export default () => {
  const api = express();

  //GET /users
  api.get("/users", verifyToken, UserController.getAllUsers);

  //GET /exists
  api.get("/exists", UserController.existsUser);

  return api;
};
