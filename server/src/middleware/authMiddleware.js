const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { TOKEN_SIGNATURE } = require("../utils/config");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    const decoded = jwt.verify(token, TOKEN_SIGNATURE);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) throw new Error();

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
};

module.exports = { authMiddleware };
