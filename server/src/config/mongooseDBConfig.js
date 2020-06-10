const mongoose = require("mongoose");
const { CONNECTION_URI, LOCAL_MONGO_DB } = require("../utils/config");
const log = require("../utils/console-alert");

const mongooseConfig = () => {
  mongoose
    .connect(CONNECTION_URI || LOCAL_MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => log.success("Connected to DB"))
    .catch((err) => log.warning(err, "Error connecting to DB"));
};

module.exports = mongooseConfig;
