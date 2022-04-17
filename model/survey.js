let mongoose = require("mongoose");

let surveyModel = mongoose.Schema(
  {
    question: String,
    option1: String,
    option2: String,
    option3: String,
    option4: String,
    responses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "response",
      },
    ],
  },

  {
    collection: "surveys",
  }
);

module.exports = mongoose.model("survey", surveyModel);
