const aws = require('aws-sdk');
require('dotenv').config();

const MailBuilder = require('./mail');

const { AWS_ACCESS_KEY_SES, SECRET_ACCESS_KEY } = process.env;
const credentials = new aws.Credentials(AWS_ACCESS_KEY_SES, SECRET_ACCESS_KEY);
aws.config.credentials = credentials;

const admin = process.env.ADMIN_EMAIL;
const ses = new aws.SES({ region: 'eu-central-1' });

exports.handler = async (event) => {
  try {
    const payload = JSON.parse(event.body);
    const { sender, text, client } = payload;
    const mail = new MailBuilder(admin, sender, client);
    const userMessage = mail.userQuestion(text);
    const feedback = mail.feedbackForUser(sender);
    await ses.sendEmail(userMessage).promise();
    return await ses.sendEmail(feedback).promise();
  } catch (err) {
    return err;
  }
};
