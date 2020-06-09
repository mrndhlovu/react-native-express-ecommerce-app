import express from "express";
import http from "http";
import passport from "passport";

import log from "./utils/console-alert";
import { PORT } from "./utils/config";

import { routesConfig } from "./utils/middleware/routesMiddleware";
import mongooseDBConfig from "./utils/middleware/mongooseDBMiddleware";
import passportConfig from "./utils/middleware/passportMiddleware";
import serverConfig from "./utils/middleware/serverConfigMiddleware";

mongooseDBConfig();
passportConfig(passport);

const app = express();
const server = http.createServer(app);

serverConfig(app, express, passport);

routesConfig(app, express);
server.listen(PORT, () => log.success(`Server running on port ${PORT}`));
process.on("exit", () => log.warning("Server shutdown."));
