const SqsService = require('../service/sqs-service.js');
const UserService = require('../service/user-service.js');

class AvatarsProcessor {
  constructor() {
    this.sqsService = new SqsService();
    this.userService = new UserService();
  }

  async processAvatars() {
    const promises = [];
    const avatarsProperties = await this.sqsService.avatarsProperties();
    if (avatarsProperties === undefined || avatarsProperties.length === 0) {
      return;
    }
    for (let { nickname, url } of avatarsProperties) {
      promises.push(this.addAvatar(nickname, url));
    }
    await Promise.all(promises);
  }

  async addAvatar(nickname, url) {
    await this.userService.addAvatar(nickname, url);
  }
}
module.exports = AvatarsProcessor;
