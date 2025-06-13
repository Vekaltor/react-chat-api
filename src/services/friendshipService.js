import User from "../model/User";
import Friendship from "../model/FriendShip";
import NotFoundError from "../exceptions/NotFoundError";
import BadRequestError from "../exceptions/BadRequestError";

class FriendshipService {
    async sendInvite(req, res) {
        const {userId} = req.params;
        const currentUser = req.user;

        const targetUser = await User.findById(userId);
        if (!targetUser) {
            throw new NotFoundError('Użytkownik nie został znaleziony');
        }

        const existingInvite = await Friendship.findOne({
            $or: [
                {sender: currentUser._id, receiver: userId},
                {sender: userId, receiver: currentUser._id}
            ]
        });

        if (existingInvite) {
            throw new BadRequestError('Zaproszenie już istnieje');
        }

        const friendship = new Friendship({
            sender: currentUser._id,
            receiver: userId,
            status: 'pending'
        });

        await friendship.save();

        res.status(201).json({
            success: true,
            message: 'Zaproszenie zostało wysłane',
            data: friendship
        });
    }

    async rejectInvite(req, res) {
        const {inviteId} = req.params;
        const currentUser = req.user;

        const invite = await Friendship.findOne({
            _id: inviteId,
            receiver: currentUser._id,
            status: 'pending'
        });

        if (!invite) {
            throw new NotFoundError('Zaproszenie nie zostało znalezione');
        }

        invite.status = 'rejected';
        await invite.save();

        res.json({
            success: true,
            message: 'Zaproszenie zostało odrzucone'
        });
    }

    async acceptInvite(req, res) {
        const {inviteId} = req.params;
        const currentUser = req.user;

        const invite = await Friendship.findOne({
            _id: inviteId,
            receiver: currentUser._id,
            status: 'pending'
        });

        if (!invite) {
            throw new NotFoundError('Zaproszenie nie zostało znalezione');
        }

        invite.status = 'accepted';
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
                {sender: currentUser._id},
                {receiver: currentUser._id}
            ]
        });

        const excludedUserIds = [
            currentUser._id,
            ...existingFriendships.map(f =>
                f.sender.toString() === currentUser._id.toString()
                    ? f.receiver
                    : f.sender
            )
        ];

        const users = await User.find({
            _id: {$nin: excludedUserIds}
        }).select('-password');

        res.json({
            success: true,
            data: users
        });
    }

    async getSentInvites(req, res) {
        const currentUser = req.user;

        const invites = await Friendship.find({
            sender: currentUser._id,
            status: 'pending'
        }).populate('receiver', 'username email');

        res.json({
            success: true,
            data: invites
        });
    }

    async getReceivedInvites(req, res) {
        const currentUser = req.user;

        const invites = await Friendship.find({
            receiver: currentUser._id,
            status: 'pending'
        }).populate('sender', 'username email');

        res.json({
            success: true,
            data: invites
        });
    }

    // async getAllFriendsForUser(req, res) {
    //     const { idUser } = req.body;
    //     let arrayOfFriends = await Friendship.find({
    //         $and: [
    //             { is_accepted: true },
    //             { $or: [{ id_user_accept: idUser }, { id_user_request: idUser }] },
    //         ],
    //     })
    //         .populate({
    //             path: "id_user_accept id_user_request",
    //             select: "_id name surname",
    //         })
    //         .sort("asc")
    //         .exec()
    //         .then((docs) => {
    //             let friends = [];
    //             docs.forEach((doc) => {
    //                 if (doc.id_user_request._id === idUser) {
    //                     friends.push(doc.id_user_accept);
    //                 } else {
    //                     friends.push(doc.id_user_request);
    //                 }
    //             });
    //             return friends;
    //         });
    //
    //     return res.status(200).send({ friends: arrayOfFriends });
    // }

    async getAllFriendsForUser(req, res) {
        try {
            const currentUser = req.user;
            if (!currentUser) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated'
                });
            }

            const friendships = await Friendship.find({
                is_accepted: true,
                $or: [
                    { id_user_request: currentUser._id },
                    { id_user_accept: currentUser._id }
                ]
            })
                .populate('id_user_request', '_id name surname photo')
                .populate('id_user_accept', '_id name surname photo');

            const friends = friendships.map(friendship => {
                const isCurrentUserRequester = friendship.id_user_request._id.toString() === currentUser._id.toString();
                const friend = isCurrentUserRequester ? friendship.id_user_accept : friendship.id_user_request;

                return {
                    _id: friend._id,
                    name: friend.name,
                    surname: friend.surname,
                    photo: friend.photo || undefined
                };
            });

            res.json({
                success: true,
                data: friends,
                count: friends.length
            });

        } catch (error) {
            console.error('Error in getAllFriendsForUser:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

export default FriendshipService;
