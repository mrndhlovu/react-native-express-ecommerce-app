const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const { ROOT_URL } = require("../utils/config");

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

module.exports = serverConfig;
