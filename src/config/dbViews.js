import { createView } from "../utils/createView";

export const views = {
  MESSAGES_PER_CONVERSATION: "messages_per_conversation",
};

export const createViewMessagesPerConversation = () => {
  createView(views.MESSAGES_PER_CONVERSATION, (db) => {
    db.createCollection(views.MESSAGES_PER_CONVERSATION, {
      viewOn: "conversations",
      pipeline: [
        {
          $lookup: {
            from: "messages",
            localField: "_id",
            foreignField: "id_conversation",
            as: "messages",
          },
        },
        {
          $lookup: {
            from: "conversation_members",
            localField: "messages.from_id_user",
            foreignField: "id_user",
            as: "members",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "members.id_user",
            foreignField: "_id",
            as: "users",
          },
        },
        {
          $project: {
            _id: 1,
            conversationName: 1,
            options: 1,
            type: 1,
            "messages._id": 1,
            "messages.message_text": 1,
            "messages.created_at": 1,
            "messages.from_id_user": 1,
            members: {
              $map: {
                input: "$members",
                as: "member",
                in: {
                  id_user: "$$member.id_user",
                  nick_name: "$$member.nick_name",
                  role: "$$member.role",
                  joined_date_time: "$$member.joined_date_time",
                  user: {
                    $let: {
                      vars: {
                        user: {
                          $arrayElemAt: [
                            "$users",
                            {
                              $indexOfArray: ["$users._id", "$$member.id_user"],
                            },
                          ],
                        },
                      },
                      in: {
                        _id: "$$user._id",
                        name: "$$user.name",
                        surname: "$$user.surname",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    });
    // db.createView(views.MESSAGES_PER_CONVERSATION, "conversations", [
    //   {
    //     $lookup: {
    //       from: "messages",
    //       localField: "_id",
    //       foreignField: "id_conversation",
    //       as: "messages",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "messages.from_id_user",
    //       foreignField: "_id",
    //       as: "members",
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       conversationName: 1,
    //       options: 1,
    //       "messages.message_text": 1,
    //       "messages.created_at": 1,
    //       "messages.from_id_user": 1,
    //       "members.name": 1,
    //       "members.surname": 1,
    //     },
    //   },
    // ]);
  });
};
