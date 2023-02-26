import { Router } from "express";
import SecretController from "../controllers/secretController";
import verifyToken from "../middlewares/verifyToken";

export default () => {
  const api = Router();

  // GET /secret
  api.get("/secret", verifyToken, SecretController.getData);

  return api;
};
