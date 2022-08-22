require('dotenv').config();
const User = require('../models/user-model');
const hashed = require('../secure/hash');
const Logger = require('../log/logger');

const AWS = require('aws-sdk');

const { QUEUE_URL: QueueUrl, REGION: region } = process.env;

const config = {
  apiVersion: '2012-11-05',
  region,
  endpoint: QueueUrl,
};

const sqs = new AWS.SQS(config);

class UserService {
  constructor() {
    this.log = new Logger();
  }

  async register(nickname, firstName, lastName, password, role) {
    const availableUser = await User.findOne({ nickname });

    if (availableUser) {
      return null;
    }

    const { hashed: hash, salt } = await hashed(password);

    await User.updateOne(
      { nickname },
      { nickname, firstName, lastName, password: hash, salt: salt, role },
      { upsert: true }
    );

    const foundUser = await User.findOne({ nickname }).select([
      'nickname',
      'firstName',
      'lastName',
      '-_id',
    ]);
    return foundUser;
  }

  async login(nickname, password) {
    const profile = await User.findOne({ nickname, isDeleted: false });
    if (!profile) {
      return null;
    }
    this.log.info(profile);

    const { hashed: hash } = await hashed(password, profile.salt);

    if (hash === profile.password) {
      const loggedUser = await User.findOne({ nickname }).select([
        'nickName',
        'firstName',
        'lastName',
        'role',
        '-_id',
      ]);
      return loggedUser;
    } else {
      return null;
    }
  }

  async update(nickname, firstName, lastName, password, role, modified) {
    const profile = await User.findOne({ nickname, isDeleted: false });

    if (!profile) {
      return null;
    }
    if (password) {
      const { hashed: hash, salt } = await hashed(password);

      profile.password = hash;
      profile.salt = salt;
    }

    if (modified && new Date(modified) <= profile.updateAt) {
      return null;
    }
    profile.firstName = firstName || profile.firstName;
    profile.lastName = lastName || profile.lastName;
    profile.role = role || profile.role;

    await profile.save();

    const foundUser = await User.findOne({ nickname }).select([
      'nickName',
      'firstName',
      'lastName',
      '-_id',
    ]);

    return foundUser;
  }

  async deleteUser(nickname) {
    return await User.softDelete({ nickname });
  }

  async getUser(nickname) {
    const user = await User.findOne({ nickname, isDeleted: false }).select([
      'nickName',
      'firstName',
      'lastName',
      '-_id',
    ]);

    if (!nickname) {
      return null;
    }
    return user;
  }

  async list(page, limit) {
    const user = await User.find({ isDeleted: false })
      .select(['nickName', 'firstName', 'lastName', '-_id'])
      .limit(limit * 1)
      .skip((page - 1) * limit);
    return user;
  }

  async addAvatar(nickname, url) {
    const availableUser = await User.findOneAndUpdate(
      {
        nickname,
        isDeleted: false,
      },
      { avatar: url }
    ).select(['nickName', 'firstName', 'lastName', '-_id', 'avatar']);

    if (!availableUser) {
      return null;
    }
    return availableUser;
  }

  async getAvatar(nickname) {
    const availableUser = await User.findOne({ nickname, isDeleted: false });
    if (!availableUser) {
      return null;
    }
    return availableUser.avatar;
  }
}

module.exports = UserService;
