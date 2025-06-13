import FriendshipController from "../controllers/friendshipController";
import express from "express";
import verifyToken from "../middlewares/verifyToken";
import UserController from "../controllers/userController";

export default () => {
    const api = express();

    // Pobranie listy znajomych
    api.get("/", verifyToken, UserController.getFriends);

    // Wysyłanie zaproszenia do znajomych
    api.post('/invite/:friendId', verifyToken, FriendshipController.sendInvite);

    // Odrzucanie zaproszenia
    api.post('/reject/:inviteId', verifyToken, FriendshipController.rejectInvite);

    // Akceptowanie zaproszenia
    api.post('/accept/:inviteId', verifyToken, FriendshipController.acceptInvite);

    // Pobieranie listy wszystkich użytkowników (z wykluczeniem znajomych i wysłanych zaproszeń)
    api.get('/discover', verifyToken, FriendshipController.getDiscoverableUsers);

    // Pobieranie listy wysłanych zaproszeń
    api.get('/sent-invites', verifyToken, FriendshipController.getSentInvites);

    // Pobieranie listy otrzymanych zaproszeń
    api.get('/received-invites', verifyToken, FriendshipController.getReceivedInvites);

    return api;
}; 
