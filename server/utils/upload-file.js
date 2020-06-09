const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const {
  S3_BUCKET,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  AWS_ACCESS_KEY_ID,
  allowedFileTypes,
} = require("./config");

const s3 = new AWS.S3();

s3.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const fileFilter = (req, file, cb) => {
  const { mimetype } = file;
  if (allowedFileTypes.includes(mimetype)) return cb(null, true);
  cb(new Error("File type cannot be uploaded!"));
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: S3_BUCKET,
    acl: "public-read",
    limits: { fileSize: 2000000 },
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.originalname });
    },
    key: (req, file, cb) => {
      cb(
        null,
        file.originalname,
        file.originalname + "-" + Date.now() + file.originalname
      );
    },
  }),
});

module.exports = upload;
