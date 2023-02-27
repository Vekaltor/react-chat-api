import express from "express";
import verifyToken from "../middlewares/verifyToken";
import UserController from "../controllers/userController";

export default () => {
  const api = express();

  //GET /users
  api.get("/:userId", verifyToken, UserController.getAllUsers);

  return api;
};
