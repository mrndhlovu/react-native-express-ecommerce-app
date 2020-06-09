const dotenv = require("dotenv");
dotenv.config();

const environment = process.env.DEVELOPMENT ? "development" : "production";
const isDevelopment = environment === "development";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const S_GRID_API_KEY = process.env.SEND_GRID_API_KEY;
const AWS_ID_POOL = process.env.AWS_ID_POOL;
const AWS_REGION = process.env.AWS_REGION;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_SECRET_ID = process.env.SPOTIFY_SECRET_ID;
const CONNECTION_URI = process.env.MONGODB_URI;
const LOCAL_MONGO_DB = process.env.LOCAL_MONGO_DB;
const PORT = process.env.PORT || 3000;
const S3_BUCKET = process.env.AWS_BUCKET_NAME;
const IMAGES_EP = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_ACCESS_KEY}`;
const allowedFileTypes = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
  "application/pdf",
];
const TOKEN_SIGNATURE = process.env.TOKEN_SIGNATURE;
const ROOT_URL =
  process.env.LOCAL_URL || `https://moneat.herokuapp.com:${PORT}`;

module.exports = {
  allowedFileTypes,
  environment,
  AWS_ACCESS_KEY_ID,
  AWS_ID_POOL,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  ROOT_URL,
  CONNECTION_URI,
  LOCAL_MONGO_DB,
  PORT,
  S_GRID_API_KEY,
  S3_BUCKET,
  TOKEN_SIGNATURE,
  isDevelopment,
  SPOTIFY_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  SPOTIFY_SECRET_ID,
  IMAGES_EP,
};
