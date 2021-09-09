const Userdb = require("../models");
const User = Userdb.user;
const Op = Userdb.Sequelize.Op;
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const https = require("https");
const fetch = require("node-fetch");
require("../config/passport")(passport);

//Gets token from the header
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

//Compares password from user input to database hashed password
comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    return cb(null, isMatch);
  });
};

exports.signUp = async (req, res) => {
  //If if request is empty
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  //checks if it is a valid email
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(req.body.email_address)) {
    res.status(400).send({
      message: "The email is invalid!",
    });
    return;
  }

  //Encrypts password for database
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email_address: req.body.email_address,
      password: hash,
      created_datetime: Date.now(),
    };

    User.create(user)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the User",
        });
      });
  });
};

exports.signIn = async (req, res) => {
  User.findOne({
    where: {
      email_address: req.body.email_address.toLowerCase(),
    },
  }).then((user) => {
    if (!user) {
      return res.status(401).send({
        message: "Authentication failed. User not found",
      });
    }
    bcrypt.compare(
      req.body.password,
      user.dataValues.password,
      function (err, result) {
        if (result) {
          var token = jwt.sign(
            JSON.parse(JSON.stringify(user)),
            "nodeauthsecret",
            { expiresIn: 86400 * 30 }
          );

          res.json({ success: true, token: "JWT " + token });
        } else {
          res.status(401).send({
            message: "Authentication failed. Wrong password",
          });
        }
      }
    );
  });
};

exports.signOut = (req, res) => {
  req.logout();
};

exports.test = (req, res) => {
  var token = getToken(req.headers);
  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      res.status(400).send({
        message: "Bad token",
      });
      return;
    }
  });
  if (token) {
    res.send("Token is authenticated");
  } else {
    return res.status(403).send({ message: "Unauthorized" });
  }
};
