const AWS = require("aws-sdk");

const {
  C4_AWS_ACCESS_KEY_ID: accessKeyId,
  C4_AWS_SECRET_ACCESS_KEY_ID: secretAccessKey,
  REGION: region,
} = process.env;

const config = {
  region,
  signatureVersion: "v4",
  accessKeyId,
  secretAccessKey,
};

exports.s3 = new AWS.S3(config);
