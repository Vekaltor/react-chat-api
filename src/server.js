import "./config/env.config";
import express, { json } from "express";
import "./config/db.config";
import i18next, { use } from "i18next";
import Backend from "i18next-fs-backend";
import { LanguageDetector, handle } from "i18next-http-middleware";
import errorHandler from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/cors.config";
import { ServerSocket } from "./socket";

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

const app = express();

app.use(handle(i18next));
app.use(json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api", authentication());
app.use("/api", secret());
app.use("/api", user());

app.use(errorHandler);

const httpServer = app.listen(process.env.SERVER_PORT || 8080, () =>
  console.log(`Server is live on port ${process.env.SERVER_PORT || 8080}`)
);

new ServerSocket(httpServer);
