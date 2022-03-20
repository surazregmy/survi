let mongoose = require("mongoose");

let surveyModel = mongoose.Schema(
  {
    question: String,
    option1: String,
    option2: String,
    option3: String,
    option4: String,
  },
  {
    collection: "surveys",
  }
);

module.exports = mongoose.model("survey", surveyModel);
