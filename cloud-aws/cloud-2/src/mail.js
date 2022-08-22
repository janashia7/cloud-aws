class MailBuilder {
  constructor(admin, sender, client) {
    this.admin = admin;
    this.sender = sender;
    this.client = client;
  }

  userQuestion(question) {
    const params = {
      Destination: {
        ToAddresses: [this.client],
      },
      Message: {
        Body: {
          Text: {
            Data: question,
          },
        },
        Subject: {
          Data: `Message from ${this.sender}`,
        },
      },
      Source: this.sender,
    };
    return params;
  }

  feedbackForUser(userName) {
    const params = {
      Destination: {
        ToAddresses: [this.sender],
      },
      Message: {
        Body: {
          Text: {
            Data: `${userName} message send successfully!`,
          },
        },
        Subject: {
          Data: 'Message sent',
        },
      },
      Source: this.admin,
    };

    return params;
  }
}

module.exports = Mail;
