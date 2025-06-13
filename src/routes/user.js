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

  //GET /available-users
  api.get("/available-users", verifyToken, UserController.getAvailableUsers);

  //DELETE /friends/reject
  api.delete("/friends/reject", verifyToken, UserController.rejectFriendship);

  //GET /conversation
  //params: idConversation
  api.get(
    "/conversation",
    verifyToken,
    ConversationController.getConversationWithMembersAndMessages
  );

  //GET /privateConversations
  // params: idUser
  api.get(
    "/privateConversations",
    verifyToken,
    ConversationController.getIdsAndMembersPrivateConversations
  );

  //POST /conversation
  /*
  params: 
  members: [
    {idUser,role}
  ]
  */
  api.post(
    "/conversation",
    verifyToken,
    ConversationController.createConversation
  );

  return api;
};
