const authenticateToken = require('../middleware/authToken');
const Controllers = require('../controllers/controllers');

const controller = new Controllers();

exports.router = (app) => {
  app.post('/register', controller.register.bind(controller));
  app.post('/login', controller.login.bind(controller));
  app.get('/list', controller.getList.bind(controller));
  app.get('/avatar', authenticateToken, controller.getAvatar.bind(controller));
  app.put('/:nickname', authenticateToken, controller.update.bind(controller));
  app.get('/:nickname', controller.getUser.bind(controller));
  app.delete(
    '/:nickname',
    authenticateToken,
    controller.delete.bind(controller)
  );
};
