const { ROOT_URL, allowedFields } = require("../utils/config.js");
const auth = require("../utils/middleware/authMiddleware").authMiddleware;
const router = require("express").Router();
const User = require("../models/User");
const {
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendPasswordChangeConfirmation,
} = require("../utils/middleware/emailMiddleware");
const {
  viewedRecentMiddleware,
} = require("../utils/middleware/boardMiddleWare");
const crypto = require("crypto");
const async = require("async");
const passport = require("passport");
const Notification = require("../models/Notification");

const generateAccessCookie = async (res, token) => {
  res.setHeader("Access-Control-Allow-Origin", ROOT_URL);
  res.cookie("access_token", token, {
    maxAge: 9999999,
    httpOnly: true,
  });
  await res.append("Set-Cookie", `access_token="${token}";`);
};

router.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.getAuthToken();
    const notification = new Notification({
      subject: "Welcome to Task Monitor!",
      description: `Welcome to Task monitor ${user.fname}. Hope you enjoy using it!`,
    });
    user.notifications.push(notification);

    sendWelcomeEmail(user.email, notification);
    await user.save();
    generateAccessCookie(res, token);
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email = null, password = null } = req.body;
    const user = await User.findByCredentials(email, password, req.query.token);

    const token = await user.getAuthToken();
    await generateAccessCookie(res, token);
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/users/me", auth, async (req, res) => {
  try {
    const data = { data: req.user };
    res.send(data);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/recovery", (req, res) => {
  const { email } = req.body;

  async.waterfall(
    [
      (done) => {
        User.findOne({ email }).exec((err, user) => {
          if (!user) done(`User with email ${email} was not found.`);
          else done(err, user);
        });
      },
      (user, done) => {
        crypto.randomBytes(20, (err, buffer) => {
          var token = buffer.toString("hex");
          done(err, user, token);
        });
      },
      (user, token, done) => {
        User.findByIdAndUpdate(
          { _id: user._id },
          {
            resetPasswordToken: token,
            resetPasswordExpires: Date.now() + 86400000,
          },
          { upsert: true, new: true }
        ).exec((err, new_user) => {
          done(err, token, new_user);
        });
      },
      async (token, user, done) => {
        const emailConfig = {
          redirectLink: `${ROOT_URL}/?#/reset-password/`,
          token,
          tokenExpires: user.resetPasswordExpires,
          email: req.body.email,
        };

        const mailSent = sendResetPasswordEmail(emailConfig);

        if (mailSent)
          return res.json({
            success: true,
            message: `Link to reset your password was sent to ${user.email} with further instructions.`,
          });
        else return done();
      },
    ],
    (err) => res.status(422).json({ message: err })
  );
});

router.post("/:token/update-password", (req, res) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  User.findOne(
    {
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    async (err, user) => {
      if (!user)
        return res.status(400).send({
          message: "Password reset token is invalid or has expired.",
        });
      if (password !== confirmPassword)
        return res.status(400).send({
          message: "Passwords do not match.",
        });
      user.password = confirmPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      const notification = new Notification({
        subject: `${user.fname}, your password has been changed.`,
        description: `${user.fname}, this is a confirmation that the password for your account ${user.email} has just been changed.`,
      });
      user.notifications.push(notification);

      await user.save();

      const mailSent = await sendPasswordChangeConfirmation(
        user.email,
        notification
      );

      if (mailSent)
        return res.json({
          success: true,
          message: `Your password for account ${user.email} has been changed.`,
        });
      else
        return res.status(400).send({
          error: "Unable to send confirmation for changing your password.",
        });
    }
  );
});

router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.delete("/delete-account", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send({ message: "Account deleted" });
  } catch (error) {
    return res.status(400).send({ error: "Failed to delete account." });
  }
});

router.patch("/update", auth, async (req, res, next) => {
  const updates = Object.keys(req.body);
  const updateBoardStar = updates[0] === "starred";

  const isValidField = updates.every((update) =>
    allowedFields.includes(update)
  );

  if (!isValidField)
    return res.status(400).send({ error: "Invalid update field" });

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    if (updateBoardStar) await viewedRecentMiddleware(req, res, next);
    else await req.user.save();

    res.send(req.user);
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/spotify",
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private"],
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    await req.user.getAuthToken().then((token) => {
      generateAccessCookie(res, token);
      res.redirect(`/#/profile?token=${token}&email=${req.user.email}`);
    });
  }
);

router.get(
  "/spotify/redirect",
  passport.authenticate("spotify"),
  async (req, res) => {
    await req.user.getAuthToken().then((token) => {
      generateAccessCookie(res, token);
      res.redirect(`/#/profile?token=${token}&email=${req.user.email}`);
    });
  }
);

module.exports = router;
