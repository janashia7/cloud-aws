const express = require("express");
const { router } = require("./router/router");
const app = express();

router(app);

app.listen(process.env.PORT || 8000);
