import { connect, createConnection, set } from "mongoose";
import { createViewMessagesPerConversation } from "./dbViews";

//MONGOOSE
const DB = {
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: {
      authSource: process.env.DB_AUTHSOURCE,
    },
    user: process.env.DB_ROOT,
    pass: process.env.DB_PASS,
  },
};

set("strictQuery", false);
const initConnectDB = () => {
  console.log("init");
  connect(process.env.DB_CONNECT, DB.options, (err, db) => {
    !err
      ? console.log("MongoDB connected")
      : console.log("MongoDB not connected ", err);

    createViewMessagesPerConversation();
  });
};

export default initConnectDB;
