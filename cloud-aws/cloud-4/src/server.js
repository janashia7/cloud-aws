const express = require('express');
const { router } = require('./router/router');
const db = require('./db/connect');
const Logger = require('./log/logger');
const AvatarsProcessor = require('./core/processor');
const avatarsProcessor = new AvatarsProcessor();

const log = new Logger();
const app = express();
app.use(express.json());
router(app);

(async () => {
  await db();
  const port = 3000;
  app.listen(port, () => log.info('listen to 3000'));
})();

setInterval(() => {
  avatarsProcessor.processAvatars();
}, 5000);
