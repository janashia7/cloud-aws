require('dotenv').config();
const SqsFactory = require('../factory/sqs-factory');

const { QUEUE_URL: QueueUrl, S3_BUCKET_URL: bucketUrl } = process.env;

const params = {
  VisibilityTimeout: 10,
  WaitTimeSeconds: 5,
  MaxNumberOfMessages: 10,
  QueueUrl,
};

class SqsService {
  constructor() {
    this.sqs = SqsFactory.sqsConfig();
  }

  async avatarsProperties() {
    const { Messages } = await this.sqs.receiveMessage(params).promise();
    if (Messages) {
      const promises = [];
      const avatarsProperties = [];
      for (let message of Messages) {
        const object = JSON.parse(message.Body);
        const { key } = object.Records[0].s3.object;
        const url = bucketUrl + key;
        avatarsProperties.push({
          nickname: key,
          url,
        });
        promises.push(
          this.sqs
            .deleteMessage({
              QueueUrl,
              ReceiptHandle: message.ReceiptHandle,
            })
            .promise()
        );
      }
      await Promise.all(promises);
      return avatarsProperties;
    }
  }
}

module.exports = SqsService;
