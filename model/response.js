let mongoose = require("mongoose");

let responseModel = mongoose.Schema(
  {
    questionId: String,
    option: String,
    survey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "survey",
    },
  },
  {
    collection: "responses",
  }
);

module.exports = mongoose.model("response", responseModel);
