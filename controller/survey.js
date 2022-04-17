let Survey = require("../model/survey");
let Response = require("../model/response");

function getErrorMessage(err) {
  if (err.errors) {
    for (let errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return "Unknown server error";
  }
}

module.exports.list = function (req, res, next) {
  Survey.find((err, surveyList) => {
    if (err) {
      return console.error(err);
    } else {
      res.status(200).json(surveyList);
    }
  });
};

module.exports.getResponse = function (req, res, next) {
  let surveyID = req.params.id;

  Response.find(
    {
      survey: surveyID,
    },
    (err, responseList) => {
      if (err) {
        return console.error(err);
      } else {
        res.status(200).json(responseList);
      }
    }
  );
};

module.exports.findOne = function (req, res, next) {
  console.log(req.params.id);
  Survey.findById(req.params.id, (err, survey) => {
    if (err) {
      return console.error(err);
    } else {
      res.status(200).json(survey);
    }
  });
};

module.exports.add = (req, res, next) => {
  let newSurvey = Survey({
    _id: req.body.id,
    question: req.body.question,
    option1: req.body.option1,
    option2: req.body.option2,
    option3: req.body.option3,
    option4: req.body.option4,
  });

  Survey.create(newSurvey, (err, item) => {
    if (err) {
      console.log(err);
      return res.status(400).send({
        success: false,
        message: getErrorMessage(err),
      });
    } else {
      return res.status(200).json(item);
    }
  });
};

module.exports.respond = (req, res, next) => {
  let newResponse = Response({
    survey: req.body.questionId,
    option: req.body.option,
  });

  Response.create(newResponse, (err, item) => {
    if (err) {
      console.log(err);
      return res.status(400).send({
        success: false,
        message: getErrorMessage(err),
      });
    } else {
      return res.status(200).json(item);
    }
  });
};

module.exports.update = (req, res, next) => {
  let id = req.params.id;

  let updatedSurvey = Survey({
    _id: id,
    question: req.body.question,
    option1: req.body.option1,
    option2: req.body.option2,
    option3: req.body.option3,
    option4: req.body.option4,
  });

  console.log(updatedSurvey);

  Survey.updateOne({ _id: id }, updatedSurvey, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        success: false,
        message: getErrorMessage(err),
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Item updated successfully.",
      });
    }
  });
};

module.exports.delete = (req, res, next) => {
  let id = req.params.id;

  Survey.remove({ _id: id }, (err) => {
    if (err) {
      console.log(err);

      return res.status(400).send({
        success: false,
        message: getErrorMessage(err),
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Item removed successfully.",
      });
    }
  });
};
