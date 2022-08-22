require('dotenv').config();
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

class SqsFactory {
  static sqsConfig(config) {
    if (config === undefined) {
      config = {};
    }
    if (config.apiVersion === undefined) {
      config.apiversion = process.env.API_VERSION;
    }
    if (config.region === undefined) {
      config.region = process.env.REGION;
    }

    sqs.config.apiVersion = config.apiversion;
    sqs.config.region = config.region;

    return sqs;
  }
}

module.exports = SqsFactory;
