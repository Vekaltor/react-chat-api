import tryCatch from "../utils/tryCatch";
import FriendshipService from "../services/friendshipService";

class FriendshipController {
    constructor() {
        this.friendshipService = new FriendshipService();
    }

    // Wysyłanie zaproszenia do znajomych
    sendInvite = (req, res) => {
        tryCatch(this.friendshipService.sendInvite(req, res));
    };

    // Odrzucanie zaproszenia
    rejectInvite = (req, res) => {
        tryCatch(this.friendshipService.rejectInvite(req, res));
    };

    // Akceptowanie zaproszenia
    acceptInvite = (req, res) => {
        tryCatch(this.friendshipService.acceptInvite(req, res));
    };

    // Pobieranie listy użytkowników do poznania
    getDiscoverableUsers = (req, res) => {
        tryCatch(this.friendshipService.getDiscoverableUsers(req, res));
    };

    // Pobieranie listy wysłanych zaproszeń
    getSentInvites = (req, res) => {
        tryCatch(this.friendshipService.getSentInvites(req, res));
    };

    // Pobieranie listy otrzymanych zaproszeń
    getReceivedInvites = (req, res) => {
        tryCatch(this.friendshipService.getReceivedInvites(req, res));
    };
}

export default new FriendshipController();
