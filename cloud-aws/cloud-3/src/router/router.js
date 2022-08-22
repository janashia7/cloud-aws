const { upload } = require("../app/app");
const Controller = require("../controller/controller");

const controller = new Controller();

exports.router = async (app) => {
  app.post("/upload", upload.single("file"), controller.upload);

  app.get("/list", controller.getList);

  app.get("/download", controller.download);
};
