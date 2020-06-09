const authRoutes = require("../../routes/auth");

const routesConfig = (app) => {
  app.use("/auth", authRoutes);
};

module.exports = { routesConfig };
