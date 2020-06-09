import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { ROOT_URL } from "../utils/config";

const BUILD_DIR = __dirname;

const serverConfig = (app, express, passport) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: ROOT_URL,
      credentials: true,
    })
  );

  app.use(passport.initialize());
  app.use(express.static(path.join(BUILD_DIR, "build")));
};

export default serverConfig;
