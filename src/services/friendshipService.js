import FriendShip from "../model/FriendShip";
import FriendshipExistsExcpetion from "../exceptions/FriendshipExistsException";

class FriendshipService {
  async getAllFriendsForUser(req, res) {
    const { idUser } = req.body;
    let arrayOfFriends = await FriendShip.find({
      $and: [
        { is_accepted: true },
        { $or: [{ id_user_accept: idUser }, { id_user_request: idUser }] },
      ],
    })
      .populate({
        path: "id_user_accept id_user_request",
        select: "_id name surname",
      })
      .sort("asc")
      .exec()
      .then((docs) => {
        let friends = [];
        docs.forEach((doc) => {
          if (doc.id_user_request._id == idUser) {
            friends.push(doc.id_user_accept);
          } else {
            friends.push(doc.id_user_request);
          }
        });
        return friends;
      });

    return res.status(200).send({ friends: arrayOfFriends });
  }

  async createFriendship(req, res, next) {
    const { fromUserId, toUserId } = req.body;
    try {
      if (await this.#existsFriendship(fromUserId, toUserId))
        throw new FriendshipExistsExcpetion();
      await FriendShip.create({
        id_user_request: fromUserId,
        id_user_accept: toUserId,
      });
      return res.status(200).send({ message: "Sended invite" });
    } catch (error) {
      next(error);
    }
  }

  async #existsFriendship(id1, id2) {
    return (await this.checkFriendship(id1, id2)) ||
      (await this.checkFriendship(id2, id1))
      ? true
      : false;
  }

  async checkFriendship(id1, id2) {
    return (await FriendShip.findOne({
      id_user_accept: id1,
      id_user_request: id2,
    }))
      ? true
      : false;
  }
}

export default FriendshipService;
