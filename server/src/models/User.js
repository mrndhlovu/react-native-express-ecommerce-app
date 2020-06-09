const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const isEmail = require("validator/lib/isEmail");

const { TOKEN_SIGNATURE } = require("../utils/config");
const {
  sendPasswordChangeConfirmation,
} = require("../middleware/emailMiddleware");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      trim: true,
      minlength: 4,
    },
    fname: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!isEmail(value)) throw new Error("Email is invalid");
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password"))
          throw new Error("Password should not include 'password'");
      },
    },
    starred: {
      type: Array,
      required: true,
      default: [],
    },
    viewedRecent: {
      type: Array,
      required: true,
      default: [],
    },
    notifications: {
      type: Array,
      required: true,
      default: [],
    },
    socialAuth: {
      type: Object,
      required: true,
      default: {
        provider: "",
        id: "",
      },
    },
    idBoards: {
      type: Array,
      required: true,
      default: [],
    },
    avatar: {
      type: Array,
      required: true,
      default: [],
    },
    bio: {
      type: String,
      trim: true,
      minlength: 4,
    },
    templates: {
      type: Array,
      required: true,
      default: [],
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.virtual("boards", {
  ref: "Board",
  localField: "_id",
  foreignField: "owner",
});

UserSchema.virtual("template", {
  ref: "Templates",
  localField: "_id",
  foreignField: "owner",
});

UserSchema.virtual("comment", {
  ref: "Comment",
  localField: "_id",
  foreignField: "owner",
});

UserSchema.virtual("InvitedBoards", {
  ref: "Board",
  localField: "_id",
  foreignField: "creator",
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

UserSchema.methods.getAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString(), expiresIn: 3600 },
    TOKEN_SIGNATURE
  );
  user.tokens = user.tokens.concat({ token });
  user.username = user.email.split("@")[0];

  await user.save();
  return token;
};

UserSchema.statics.findByCredentials = async (email, password, token) => {
  const user = await UserSchema.findOne({ email });
  let isMatch;
  if (!user) throw new Error("Login error: check your email or password.");
  if (password) {
    isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Login error: check your email or password.");
  } else {
    isMatch = user.tokens.find((tokenObj) => tokenObj.token === token);
    if (!isMatch) throw new Error("Login error: check your email or password.");
  }

  return user;
};

UserSchema.pre("save", function (next) {
  const user = this;
  const SALT_FACTOR = 12;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (error, hash) => {
      if (err) return next(error);
      user.password = hash;
      sendPasswordChangeConfirmation(user.email, user.fname);
      next();
    });
  });
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
