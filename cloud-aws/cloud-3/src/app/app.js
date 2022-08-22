require("dotenv").config();

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const region = process.env.AWS_REGION;
const bucket = process.env.S3_BUCKET;

aws.config.update({
  secretAccessKey,
  accessKeyId,
  region,
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    bucket,
    s3,
    acl: "public-read",
    key: (req, file, cb) => {
      cb(
        null,
        req.query.path
          ? `${req.query.path}/${file.originalname}`
          : file.originalname
      );
    },
  }),
});

module.exports = { s3, upload, bucket };
