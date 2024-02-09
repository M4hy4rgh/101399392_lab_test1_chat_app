const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    maxlength: 80,
  },
},
{
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;