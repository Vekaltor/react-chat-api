import "./config/env";
import express, { json } from "express";
import { set, connect } from "mongoose";
import DB from "./config/database";
import i18next, { use } from "i18next";
import Backend from "i18next-fs-backend";
import { LanguageDetector, handle } from "i18next-http-middleware";
import errorHandler from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";

//Imports Routes
import authentication from "./routes/auth";
import secret from "./routes/secret";

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
  (err) => console.log("Not connected ", err)
);

const app = express();

app.use(handle(i18next));
app.use(json());
app.use(cookieParser());

app.use("/api", authentication());
app.use("/api", secret());

app.use(errorHandler);

app.listen(process.env.SERVER_PORT || 8080, () =>
  console.log(`Server is live on port ${process.env.SERVER_PORT || 8080}`)
);
