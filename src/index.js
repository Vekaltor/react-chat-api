import "./config/env";
import express, { json } from "express";
import { set, connect } from "mongoose";
import DB from "./config/database";
import i18next, { use } from "i18next";
import Backend from "i18next-fs-backend";
import { LanguageDetector, handle } from "i18next-http-middleware";
import errorHandler from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/cors";
// import io from "socket.io";

//Imports Routes
import authentication from "./routes/auth";
import secret from "./routes/secret";
import user from "./routes/user";

use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: "./locales/{{lng}}/translation.json",
    },
  });

set("strictQuery", false);
connect(process.env.DB_CONNECT, DB.options).then(
  () => console.log("connected"),
  (err) => {
    console.log("Not connected ", err);
    throw err;
  }
);

const app = express();
// io = io(app);

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   socket.on("disconnect", () => {
//     console.log("a user disconnected");
//   });
// });

app.use(handle(i18next));
app.use(json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api", authentication());
app.use("/api", secret());
app.use("/api", user());

app.use(errorHandler);

app.listen(process.env.SERVER_PORT || 8080, () =>
  console.log(`Server is live on port ${process.env.SERVER_PORT || 8080}`)
);
