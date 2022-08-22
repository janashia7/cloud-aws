const { s3, bucket } = require("../app/app");

class Controller {
  upload = async (req, res) => {
    res.send(`successfully uploaded ${req.file.location} location!`);
  };

  getList = async (req, res) => {
    const { path } = req.query;
    const objects = await s3
      .listObjectsV2({ Bucket: bucket, Prefix: path })
      .promise();

    const objKey = objects.Contents;
    res.send(objKey);
  };

  download = async (req, res) => {
    const filename = req.query.file;
    return await s3
      .getObject({ Bucket: bucket, Key: filename })
      .createReadStream()
      .pipe(res);
  };
}

module.exports = Controller;
