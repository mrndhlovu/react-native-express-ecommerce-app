const express = require("express");
const http = require("http");
const passport = require("passport");

const { PORT } = require("./utils/config");
const log = require("./utils/console-alert");
const mongooseDBConfig = require("./config/mongooseDBConfig");
const passportConfig = require("./config/passportConfig");
const routesConfig = require("./config/routesConfig");
const serverConfig = require("./config/serverConfig");

mongooseDBConfig();
passportConfig(passport);

const app = express();
const server = http.createServer(app);

serverConfig(app, express, passport);

routesConfig(app, express);
server.listen(PORT, () => log.success(`Server listening on port ${PORT}`));
process.on("exit", () => log.warning("Server shutdown."));
