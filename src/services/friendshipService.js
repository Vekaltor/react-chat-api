import FriendShip from "../model/FriendShip";
import FriendshipExistsExcpetion from "../exceptions/FriendshipExistsException";
import User from "../model/User";

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
          if (doc.id_user_request._id === idUser) {
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
        (await this.checkFriendship(id2, id1));
  }

  async checkFriendship(id1, id2) {
    return !!(await FriendShip.findOne({
      id_user_accept: id1,
      id_user_request: id2,
    }));
  }

  async getAvailableUsers(req, res) {
    const { idUser } = req.body;
    
    // Pobierz wszystkich użytkowników
    const allUsers = await User.find()
      .select("_id name surname contact")
      .exec();

    // Pobierz wszystkie relacje znajomości dla danego użytkownika
    const friendships = await FriendShip.find({
      $or: [
        { id_user_request: idUser },
        { id_user_accept: idUser }
      ]
    }).exec();

    // Utwórz zbiór ID użytkowników, którzy są już znajomymi lub mają oczekujące zaproszenia
    const excludedUserIds = new Set([
      idUser, // Wyklucz samego siebie
      ...friendships.map(f => 
        f.id_user_request.toString() === idUser 
          ? f.id_user_accept.toString() 
          : f.id_user_request.toString()
      )
    ]);

    // Filtruj użytkowników, którzy nie są jeszcze znajomymi
    const availableUsers = allUsers.filter(user => 
      !excludedUserIds.has(user._id.toString())
    );

    return res.status(200).send({ users: availableUsers });
  }

  async rejectFriendship(req, res, next) {
    const { fromUserId, toUserId } = req.body;
    try {
      const friendship = await FriendShip.findOne({
        id_user_request: fromUserId,
        id_user_accept: toUserId,
        is_accepted: false
      });

      if (!friendship) {
        return res.status(404).send({ message: "Zaproszenie nie znalezione" });
      }

      await FriendShip.deleteOne({ _id: friendship._id });
      return res.status(200).send({ message: "Zaproszenie odrzucone" });
    } catch (error) {
      next(error);
    }
  }
}

export default FriendshipService;
