var express = require("express");
var router = express.Router();

let surveyController = require("../controller/survey");

router.get("/list", surveyController.list);

router.post("/add", surveyController.add);

router.put("/edit/:id", surveyController.update);

router.delete("/delete/:id", surveyController.delete);

module.exports = router;
