var express = require("express");
var router = express.Router();

let surveyController = require("../controller/survey");
const verifyJWT = require("../middleware/verifyJWT");

router.get("/list", surveyController.list);

router.get("/get/:id", surveyController.findOne);

router.post("/add", surveyController.add);

router.put("/edit/:id", surveyController.update);

router.delete("/delete/:id", surveyController.delete);

router.post("/respond", surveyController.respond);

router.get("/responses/:id", surveyController.getResponse);

module.exports = router;
