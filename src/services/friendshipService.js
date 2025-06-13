import User from "../model/User";
import Friendship from "../model/FriendShip";
import NotFoundError from "../exceptions/NotFoundError";
import BadRequestError from "../exceptions/BadRequestError";

class FriendshipService {
    async sendInvite(req, res) {
        const { userId } = req.params;
        const currentUser = req.user;

        if (!userId) {
            throw new BadRequestError('userId jest wymagane');
        }

        const targetUser = await User.findById(userId);
        if (!targetUser) {
            throw new NotFoundError('Użytkownik nie został znaleziony');
        }

        if (currentUser._id.toString() === userId) {
            throw new BadRequestError('Nie możesz dodać siebie jako znajomego');
        }

        // Sprawdź czy już istnieje relacja
        const existingFriendship = await Friendship.findOne({
            $or: [
                { id_user_request: currentUser._id, id_user_accept: userId },
                { id_user_request: userId, id_user_accept: currentUser._id }
            ]
        });

        if (existingFriendship) {
            if (existingFriendship.is_accepted) {
                throw new BadRequestError('Już jesteście znajomymi');
            } else {
                // Jeśli istnieje pending request i current user jest odbiorcą, zaakceptuj
                if (existingFriendship.id_user_accept.toString() === currentUser._id.toString()) {
                    existingFriendship.is_accepted = true;
                    await existingFriendship.save();

                    return res.status(200).json({
                        success: true,
                        message: 'Zaproszenie zostało zaakceptowane'
                    });
                } else {
                    throw new BadRequestError('Zaproszenie już zostało wysłane');
                }
            }
        }

        // Utwórz nowe zaproszenie
        const friendship = new Friendship({
            id_user_request: currentUser._id,
            id_user_accept: userId,
            is_accepted: false
        });

        await friendship.save();

        res.status(201).json({
            success: true,
            message: 'Zaproszenie zostało wysłane',
            data: friendship
        });
    }

    async rejectInvite(req, res) {
        const { inviteId } = req.params;

        if (!inviteId) {
            throw new BadRequestError('inviteId jest wymagane');
        }

        const friendship = await Friendship.findOneAndDelete({
            _id: inviteId,
        });

        if (!friendship) {
            throw new NotFoundError('Zaproszenie nie zostało znalezione');
        }

        res.json({
            success: true,
            message: 'Zaproszenie zostało odrzucone'
        });
    }

    async acceptInvite(req, res) {
        const { inviteId } = req.params;
        const currentUser = req.user;

        const invite = await Friendship.findOne({
            _id: inviteId,
            id_user_accept: currentUser._id,
            is_accepted: false
        });

        if (!invite) {
            throw new NotFoundError('Zaproszenie nie zostało znalezione');
        }

        invite.is_accepted = true;
        await invite.save();

        res.json({
            success: true,
            message: 'Zaproszenie zostało zaakceptowane'
        });
    }

    async getDiscoverableUsers(req, res) {
        const currentUser = req.user;

        const existingFriendships = await Friendship.find({
            $or: [
                { id_user_request: currentUser._id },
                { id_user_accept: currentUser._id }
            ]
        });

        const connectedUserIds = [
            currentUser._id,
            ...existingFriendships.map(f =>
                f.id_user_request.toString() === currentUser._id.toString()
                    ? f.id_user_accept
                    : f.id_user_request
            )
        ];

        const users = await User.find({
            _id: { $nin: connectedUserIds }
        }).select('id name surname avatar');

        res.json({
            success: true,
            users: users
        });
    }

    async getSentInvites(req, res) {
        const currentUser = req.user;

        const invites = await Friendship.find({
            id_user_request: currentUser._id,
            is_accepted: false
        }).populate('id_user_accept', 'id name surname avatar');

        res.json({
            success: true,
            users: invites
        });
    }

    async getReceivedInvites(req, res) {
        const currentUser = req.user;

        const invites = await Friendship.find({
            id_user_accept: currentUser._id,
            is_accepted: false
        }).populate('id_user_request', 'id name surname avatar');

        res.json({
            success: true,
            users: invites
        });
    }

    async getAllFriendsForUser(req, res) {
        try {
            const { userId } = req.body;
            const userIdToCheck = userId || req.user._id;

            if (!userIdToCheck) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID jest wymagane'
                });
            }

            const friendships = await Friendship.find({
                is_accepted: true,
                $or: [
                    { id_user_request: userIdToCheck },
                    { id_user_accept: userIdToCheck }
                ]
            })
                .populate('id_user_request', 'id name username avatar email')
                .populate('id_user_accept', 'id name username avatar email');

            const friends = friendships.map(friendship => {
                const isCurrentUserRequester = friendship.id_user_request._id.toString() === userIdToCheck.toString();
                const friend = isCurrentUserRequester ? friendship.id_user_accept : friendship.id_user_request;

                return {
                    _id: friend._id,
                    name: friend.name,
                    username: friend.username,
                    avatar: friend.avatar || undefined,
                    email: friend.email
                };
            });

            res.json({
                success: true,
                friends: friends,
                count: friends.length
            });

        } catch (error) {
            console.error('Error in getAllFriendsForUser:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default FriendshipService;
