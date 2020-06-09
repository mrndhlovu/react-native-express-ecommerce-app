import express from "express";
import http from "http";
import passport from "passport";

import log from "./utils/console-alert";
import { PORT } from "./utils/config";

import routesConfig from "./config/routesConfig";
import mongooseDBConfig from "./config/mongooseDBConfig";
import passportConfig from "./config/passportConfig";
import serverConfig from "./config/serverConfig";

mongooseDBConfig();
passportConfig(passport);

const app = express();
const server = http.createServer(app);

serverConfig(app, express, passport);

routesConfig(app, express);
server.listen(PORT, () => log.success(`Server running on port ${PORT}`));
process.on("exit", () => log.warning("Server shutdown."));
