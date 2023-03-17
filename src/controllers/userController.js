import tryCatch from "../utils/tryCatch";
import UserService from "../services/userService";
import FriendshipService from "../services/friendshipService";

class UserController {
  constructor() {
    this.userService = new UserService();
    this.friendshipService = new FriendshipService();
  }
  getAllUsers = (req, res, next) => {
    tryCatch(this.userService.getAllUsers(req, res, next));
  };

  getFriends = (req, res) => {
    tryCatch(this.friendshipService.getAllFriendsForUser(req, res));
  };

  addFriends = (req, res, next) => {
    tryCatch(this.friendshipService.createFriendship(req, res, next));
  };
}

export default new UserController();
