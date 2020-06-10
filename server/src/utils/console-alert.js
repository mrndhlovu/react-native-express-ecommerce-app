const chalk = require("chalk");
/* eslint-disable */
const print = (color, identifier, message) =>
  console.log(chalk.inverse[color].bold(`${identifier || ""}==>`, message));

const success = (message, identifier) => print("green", identifier, message);

const warning = (message, identifier) => print("red", identifier, message);

const info = (message, identifier) =>
  console.log(`${identifier || ""}==>`, message);

/* eslint-disable */

module.exports = { success, warning, info };
