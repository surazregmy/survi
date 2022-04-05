let mongoose = require("mongoose");

let userModel = mongoose.Schema(
  {
    username: String,
    password: String,
    refresh_token: String,
    role: String,
  },
  {
    collection: "users",
  }
);

module.exports = mongoose.model("user", userModel);
