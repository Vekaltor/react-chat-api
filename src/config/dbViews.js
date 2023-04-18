import { createView } from "../utils/createView";

export const views = {
  MESSAGES_PER_CONVERSATION: "messages_per_conversation",
};

export const createViewMessagesPerConversation = (db) => {
  createView(db, views.MESSAGES_PER_CONVERSATION, () => {
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
      ],
    });
  });
};
