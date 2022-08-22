const { s3 } = require("./s3-config");

const { S3_BUCKET: Bucket } = process.env;

exports.handler = async (event) => {
  try {
    const { nickname } = event.queryStringParameters;

    const url = await s3.getSignedUrlPromise("putObject", {
      Bucket,
      Key: nickname,
      Expires: 60 * 100,
    });

    return { URL: url };
  } catch {
    return { Message: "nickname not found" };
  }
};
