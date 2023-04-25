import express from "express";
import verifyToken from "../middlewares/verifyToken";
import UserController from "../controllers/userController";
import ConversationController from "../controllers/conversationController";

export default () => {
  const api = express();

  //GET /users
  api.get("/users", verifyToken, UserController.getAllUsers);

  //POST /friends
  api.post("/friends", verifyToken, UserController.getFriends);

  //PUT /friends
  api.put("/friends", verifyToken, UserController.addFriends);

  //GET /conversation
  //params: idConversation
  api.get(
    "/conversation",
    verifyToken,
    ConversationController.getConversationWithMembersAndMessages
  );

  //GET /conversations
  api.get(
    "/conversations",
    verifyToken,
    ConversationController.getConversations
  );

  //POST /conversation
  //params: members
  api.post(
    "/conversation",
    verifyToken,
    ConversationController.createConversation
  );

  return api;
};
