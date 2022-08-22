const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { softDeletePlugin } = require('soft-delete-plugin-mongoose');

const userSchema = new Schema(
  {
    nickname: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    role: { type: String, required: true },
    avatar: { type: String },
  },
  { timestamps: true }
);

userSchema.plugin(softDeletePlugin);

const User = mongoose.model('User', userSchema);

module.exports = User;
