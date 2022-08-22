const jwt = require('jsonwebtoken');
const UserService = require('../service/user-service');

class Controllers {
  constructor() {
    this.userService = new UserService();
  }
  async register(req, res) {
    const { nickname, firstName, lastName, password, role } = req.body;
    if (!nickname || !password) {
      return res.sendStatus(400);
    }

    const profile = await this.userService.register(
      nickname,
      firstName,
      lastName,
      password,
      role
    );

    if (profile) {
      res.send(profile);
    } else {
      res.sendStatus(400);
    }
  }

  async login(req, res) {
    const { nickname, password } = req.body;
    const profile = await this.userService.login(nickname, password);
    const role = profile.role;
    const accessToken = jwt.sign(
      { name: nickname, role: role },
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!nickname || !password) {
      return res.sendStatus(400);
    }
    if (profile) {
      res.send({ accessToken: accessToken });
    } else {
      res.sendStatus(400);
    }
  }

  async getList(req, res) {
    const { page = 1, limit = 10 } = req.query;

    const lists = await this.userService.list(page, limit);
    res.send(lists);
  }

  async update(req, res) {
    const { firstName, lastName, password, role } = req.body;
    const { nickname } = req.params;
    if (
      (req.user.name === nickname && req.user.role === 'user') ||
      req.user.role === 'admin'
    ) {
      const profile = await this.userService.update(
        nickname,
        firstName,
        lastName,
        password,
        role,
        req.headers['if-unmodified-since']
      );
      if (profile) {
        res.header('Last-Modified', new Date());
        res.send(profile);
      }
    } else {
      res.status(401).send('You have not permission');
    }
  }

  async getUser(req, res) {
    const { nickname } = req.params;

    const userProfile = await this.userService.getUser(nickname);
    if (userProfile) {
      res.send(userProfile);
    } else {
      res.sendStatus(400);
    }
  }

  async delete(req, res) {
    const { nickname } = req.params;
    if (
      (req.user.name !== nickname || req.user.name === nickname) &&
      req.user.role === 'admin'
    ) {
      const userProfile = await this.userService.deleteUser(nickname);
      if (userProfile === false) {
        return res.sendStatus(400);
      } else {
        res.status(400).send('deleted');
      }
    } else {
      res.status(401).send('You have not permission');
    }

    if (!nickname) {
      return res.sendStatus(400);
    }
  }

  async getAvatar(req, res) {
    const { name } = req.user;

    const getAvatarByName = await this.userService.getAvatar(name);
    res.send(getAvatarByName);
  }
}

module.exports = Controllers;
