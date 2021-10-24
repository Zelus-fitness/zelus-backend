const Userdb = require("../models");
const User = Userdb.user;
const Op = Userdb.Sequelize.Op;

const Exercise = Userdb.exercise;

const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
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
  if (
    req.body &&
    Object.keys(req.body).length === 0 &&
    Object.getPrototypeOf(req.body) === Object.prototype
  ) {
    res.status(400).send({
      message: "Content can not be empty!",
      success: false,
    });
    return;
  }

  //checks if it is a valid email
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1, 3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(req.body.email_address)) {
    res.status(400).send({
      message: "The email is invalid!",
      success: false,
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
        var successobject = { success: true };
        var successdata = {...data, ...successobject}
        res.send(successdata);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the User",
          success: false,
        });
      });
  });
};

// Sign in
exports.signIn = async (req, res) => {
  if (
    req.body &&
    Object.keys(req.body).length === 0 &&
    Object.getPrototypeOf(req.body) === Object.prototype
  ) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  User.findOne({
    where: {
      email_address: req.body.email_address.toLowerCase(),
    },
  }).then((user) => {
    if (!user) {
      return res.status(401).send({
        message: "Authentication failed. User not found",
        success: false,
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
            success: false,
          });
        }
      }
    );
  });
};

// Sign out
exports.signOut = (req, res) => {
  req.logout();
};

// Return basic profile information
exports.getProfile = (req, res) => {
  var token = getToken(req.headers);

  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      res.status(400).send({
        message: "Bad token",
        success: false,
      });
      return;
    }
  });
  if (token) {
    id = jwt_decode(token).id;

    User.findByPk(id)
      .then((data) => {
        res.send({
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email_address: data.email_address,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error restrieving User with id=" + id,
          success: false,
        });
        console.log(err);
      });
  } else {
    return res.status(403).send({ message: "Unauthorized.", success: false });
  }
};

//Change some basic profile information
exports.updateProfile = (req, res) => {
  if (
    req.body &&
    Object.keys(req.body).length === 0 &&
    Object.getPrototypeOf(req.body) === Object.prototype
  ) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  var token = getToken(req.headers);
  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      res.status(400).send({
        message: "Bad token",
        success: false,
      });
      return;
    }
  });

  if (token) {
    const id = jwt_decode(token).id;
    tempobj = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    };

    User.update(tempobj, {
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully",
            success: true,
          });
        } else {
          res.status(400).send({
            message: `Cannot update User, ${id}. Maybe User was not found or your request was empty`,
            success: false,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating User with id=" + id,
          success: false,
        });
        console.log(err);
      });
  } else {
    return res.status(403).send({ message: "Unauthorized.", success: false });
  }
};

exports.getExercise = (req, res) => {
  var token = getToken(req.headers);
  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      res.status(400).send({
        message: "Bad token",
        success: false,
      });
      return;
    }
  });

  if (token) {
    Exercise.findByPk(req.params.id)
      .then((data) => {
        res.send({
          id: data.id,
          name: data.name,
          public: data.public,
          sets: data.sets,
          reps: data.reps,
          rpe: data.rpe,
          type: data.type,
          created_by: data.created_by,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: `Error getting exercise by id ${req.params.id}`,
          success: false,
        });
        console.log(err);
      });
  } else {
    return res.status(403).send({ message: "Unauthorized.", success: false });
  }
};

//Create Exercise
exports.createExercise = (req, res) => {
  if (
    req.body &&
    Object.keys(req.body).length === 0 &&
    Object.getPrototypeOf(req.body) === Object.prototype
  ) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  var token = getToken(req.headers);
  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      res.status(400).send({
        message: "Bad token",
        success: false,
      });
      return;
    }
  });

  if (token) {
    const id = jwt_decode(token).id;
    const exercise = {
      name: req.body.name,
      public: req.body.public,
      sets: req.body.sets,
      reps: req.body.reps,
      rpe: req.body.rpe,
      type: req.body.type,
      created_by: id,
    };
    Exercise.create(exercise)
      .then((data) => {
        data.success = true;
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err,
          success: false,
        });
      });
  } else {
    return res.status(403).send({ message: "Unauthorized.", success: false });
  }
};

// Edit exercise
exports.editExercise = (req, res) => {
  if (
    req.body &&
    Object.keys(req.body).length === 0 &&
    Object.getPrototypeOf(req.body) === Object.prototype
  ) {
    res.status(400).send({
      message: "Content can not be empty!",
      success: false,
    });
    return;
  }

  var token = getToken(req.headers);
  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      res.status(400).send({
        message: "Bad token",
        success: false,
      });
      return;
    }
  });

  if (token) {
    const exercise = {
      name: req.body.name,
      public: req.body.public,
      sets: req.body.sets,
      reps: req.body.reps,
      rpe: req.body.rpe,
      type: req.body.type,
    };
    Exercise.update(exercise, {
      where: { id: req.params.id },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Exercise was updated successfully",
            success: true,
          });
        } else {
          res.send(400).send({
            message: `Cannot update Exercise, ${id}. Maybe Exercise was not found or your request was empty`,
            success: false,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating Excerise with id=" + id,
          success: false,
        });
        console.log(err);
      });
  } else {
    return res.status(403).send({ message: "Unauthorized.", success: false });
  }
};

exports.deleteExercise = (req, res) => {
  const exercise_id = req.params.id;

  var token = getToken(req.headers);
  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      res.status(400).send({
        message: "Bad token",
        success: false,
      });
      return;
    }
  });

  if (token) {
    const token_user_id = jwt_decode(token).id;
    Exercise.findByPk(exercise_id)
      .then((data) => {
        var exercise_created_by = data.created_by;
        if (exercise_created_by === token_user_id) {
          Exercise.destroy({
            where: { id: exercise_id },
          })
            .then((num) => {
              if (num === 1) {
                res.send({
                  message: "Exercise was deleted successfully",
                  success: true,
                });
              } else {
                res.status(400).send({
                  message: "You did not create this exercise",
                  success: false,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send({
                message: `Could not delete Exercise ${exercise_id}`,
                success: false,
              });
            });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err,
          success: false,
        });
      });
  } else {
    return res.status(403).send({ message: "Unauthorized", success: false });
  }
};

// Test API Endpoint
exports.test = (req, res) => {
  var token = getToken(req.headers);
  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      res.status(400).send({
        message: "Bad token",
        success: false,
      });
      return;
    }
  });
  if (token) {
    res.send({ message: "Token is authenticated", success: true });
  } else {
    return res.status(403).send({ message: "Unauthorized", success: false });
  }
};
