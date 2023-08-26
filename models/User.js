const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      maxlength: 25,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    roles: {
      type: String,
      required: true,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    telephone: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      maxlength: 30,
    },
    address: {
      type: String,
      maxlength: 60,
    },
    favorite: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Idea",
      },
    ],
    status: {
      type: String,
      enum: ["ONLINE", "OFLINE"],
    },
    gcu: {
      type: Boolean,
      default: "false",
    },
  });
const User = mongoose.model('User', userSchema)
module.exports = User;