let User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.login = async (req, res, next) => {
  //   return res.status(200).json("I am in the login");
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  const user = await User.findOne({
    username: username,
  });

  if (!user) return res.status(401).json({ message: "User does not Exists" });
  //evaluate password

  const match = await bcrypt.compare(password, user.password);
  if (match) {
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "300s" }
    );
    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await updateRefreshInDB(user, refreshToken, res);

    delete user.refreshToken;
    delete user.password;

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ user: user, accessToken: accessToken });
  } else {
    return res.status(401).json({ message: "Invalid Credentials" });
  }
};

const updateRefreshInDB = async (user, refreshToken, res) => {
  const userID = user._id;
  const test = User.updateOne(
    {
      _id: userID,
    },
    { refresh_token: refreshToken },
    (err, item) => {
      if (err) {
        console.log(err);
        return res.status(400).send({
          success: false,
          message: getErrorMessage(err),
        });
      }
    }
  );
};
const resetRefreshInDB = async (refresh_token) => {
  console.log("The refresh token is + ");
  console.log(refresh_token);
  await User.updateOne({ refresh_token: refresh_token }, { refresh_token: "" });
};

module.exports.signup = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  const duplicate = await User.findOne({
    username: username,
  });
  console.log(duplicate);
  if (duplicate)
    return res.status(400).json({ message: "User Already Exists" });

  const encryptedPassword = await bcrypt.hash(password, 12);
  User.create(
    {
      username: username,
      password: encryptedPassword,
    },
    (err, item) => {
      if (err) {
        console.log(err);
        return res.status(400).send({
          success: false,
          message: getErrorMessage(err),
        });
      } else {
        return res.status(200).json(item);
      }
    }
  );
};

module.exports.handleRefreshToken = async (req, res, next) => {
  const cookies = req.cookies;

  console.log("At handle Refresh token");
  console.log(cookies.jwt);
  if (!cookies.jwt) return res.status(403).json({ message: "Unathorized" });
  const refreshToken = cookies.jwt;
  const user = await User.findOne({
    refresh_token: refreshToken,
  });

  if (!user) return res.status(403).json({ message: "Unathorized" });

  //evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.username !== decoded.username)
      return res.status(403).json({ message: "Unathorized" });

    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3000000s" }
    );
    return res.json({ user: user, accessToken: accessToken });
  });
};

module.exports.handleLogout = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.status(204).json({ message: "Logged out!" });
  const refreshToken = cookies.jwt;
  const user = await User.findOne({
    refresh_token: refreshToken,
  });

  if (!user) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.status(204).json({ message: "Logged Out!" });
  } else {
    resetRefreshInDB(refreshToken);
  }
  return res.json({ message: "Logged Out!" });
};
