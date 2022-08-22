require('dotenv').config();
const mongoose = require('mongoose');
const Logger = require('../log/logger');

const log = new Logger();

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    log.info('connected');
  } catch (error) {
    log.info(error);
  }
};

module.exports = connect;
