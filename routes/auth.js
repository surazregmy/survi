var express = require("express");
var router = express.Router();

let authController = require("../controller/auth");

router.post("/login", authController.login);

router.post("/signup", authController.signup);

router.get("/refreshToken", authController.handleRefreshToken);

router.get("/logout", authController.handleLogout);

module.exports = router;
