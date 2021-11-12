const Userdb = require("../models");
const User = Userdb.user;
const sequelize_function = Userdb.sequelize;
const Op = Userdb.Sequelize.Op;
const Exercise = Userdb.exercise;
const ExtendedUser = Userdb.extendeduser;
const Workout = Userdb.workout;
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
    return res.status(400).send({
      message: "Content can not be empty!",
      success: false,
    });
  }

  //checks if it is a valid email
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1, 3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(req.body.email_address)) {
    return res.status(400).send({
      message: "The email is invalid!",
      success: false,
    });
  }

  //Encrypts password for database
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email_address: req.body.email_address.toLowerCase(),
      password: hash,
      created_datetime: Date.now(),
    };

    User.create(user)
      .then((data) => {
        var success_data = { ...data, success: true };
        ExtendedUser.create({ id: data.dataValues.id })
          .then((data) => {
            res.send(success_data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        return res.status(500).send({
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
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log(req);
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
          return res.status(401).send({
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
      return res.status(400).send({
        message: "Bad token",
        success: false,
      });
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
        return res.status(500).send({
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
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  var token = getToken(req.headers);
  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      return res.status(400).send({
        message: "Bad token",
        success: false,
      });
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
          return res.status(400).send({
            message: `Cannot update User, ${id}. Maybe User was not found or your request was empty`,
            success: false,
          });
        }
      })
      .catch((err) => {
        return res.status(500).send({
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
      return res.status(400).send({
        message: "Bad token",
        success: false,
      });
    }
  });

  if (token) {
    Exercise.findByPk(req.params.id)
      .then((data) => {
        res.send({
          id: data.id,
          name: data.name,
          details: data.details,
          type: data.type,
          created_by: data.created_by,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({
          message: `Error getting exercise by id ${req.params.id}`,
          success: false,
        });
      });
  } else {
    return res.status(403).send({ message: "Unauthorized.", success: false });
  }
};

//Create Exercise
exports.createExercise = (req, res) => {
  var correct_keys = ["sets", "reps", "rpe"];
  var token = getToken(req.headers);
  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      return res.status(400).send({
        message: "Bad token",
        success: false,
      });
    }
  });
  var exercise_details = req.body.details;
  //Type checking and correct keys for details JSON
  for (var i = 0; i < exercise_details.length; i++) {
    var hasAllKeys = correct_keys.every((item) =>
      exercise_details[i].hasOwnProperty(item)
    );
    if (!hasAllKeys) {
      return res.status(400).send({
        message: "There has been an error with your Object key.",
      });
    }

    //Type checking for details object
    for (key in exercise_details[i]) {
      if (
        typeof exercise_details[i][key] != "number" ||
        exercise_details[i][key] % 1 != 0
      ) {
        return res.status(400).send({
          message: "There is a type error",
        });
      }
    }
  }

  if (token) {
    const id = jwt_decode(token).id;
    const exercise = {
      name: req.body.name,
      details: req.body.details,
      type: req.body.type,
      created_by: id,
    };
    Exercise.create(exercise)
      .then((data) => {
        var success_data = { data: { data }, success: true };
        ExtendedUser.update(
          {
            exercise_create: sequelize_function.fn(
              "array_append",
              sequelize_function.col("exercise_create"),
              data.id
            ),
          },
          {
            where: { id: id },
          }
        )
          .then((data) => {
            res.send(success_data);
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).send({
              message: "There has been an error creating your exercise",
              success: false,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({
          message: "There has been an error creating your exercise",
          success: false,
        });
      });
  } else {
    return res.status(403).send({ message: "Unauthorized.", success: false });
  }
};

// Edit exercise
exports.editExercise = (req, res) => {
  var correct_keys = ["sets", "reps", "rpe"];
  if (
    req.body &&
    Object.keys(req.body).length === 0 &&
    Object.getPrototypeOf(req.body) === Object.prototype
  ) {
    return res.status(400).send({
      message: "Content can not be empty!",
      success: false,
    });
  }

  var token = getToken(req.headers);
  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      return res.status(400).send({
        message: "Bad token",
        success: false,
      });
    }
  });

  //Type checking and correct keys for details JSON
  for (var i = 0; i < req.body.details; i++) {
    for (const str of correct_keys) {
      if (Object.keys(i).includes(str)) {
        continue;
      } else {
        return res.status(400).send({
          message: "There has been an error with your Object key.",
        });
      }
    }

    for (const key in i) {
      if (Number.isInteger(i[key])) {
        continue;
      } else {
        return res.status(400).send({
          message: "There is a type error",
        });
      }
    }
  }

  if (token) {
    const exercise = {
      name: req.body.name,
      details: req.body.details,
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
        return res.status(500).send({
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
      return res.status(400).send({
        message: "Bad token",
        success: false,
      });
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
                var success_message = {
                  message: "Exercise was deleted successfully",
                  success: true,
                };
              } else {
                return res.status(400).send({
                  message: "You did not create this exercise",
                  success: false,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).send({
                message: `Could not delete Exercise ${exercise_id}`,
                success: false,
              });
            });
        }
      })
      .catch((err) => {
        return res.status(500).send({
          message: err,
          success: false,
        });
      });
  } else {
    return res.status(403).send({ message: "Unauthorized", success: false });
  }
};

// Return all exercises based on user ID
exports.getExerciseByUser = (req, res) => {
  var token = getToken(req.headers);
  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      return res.status(400).send({
        message: "Bad token",
        success: false,
      });
    }
  });

  if (token) {
    const id = jwt_decode(token).id;

    Exercise.findAll({
      where: {
        created_by: id,
      },
    })
      .then((data) => {
        var data = { data: { data }, success: true };
        res.send(data);
      })
      .catch((error) => {
        return res.status(400).send({
          message: "User not recognized",
          success: false,
        });
      });
  } else {
    return res.status(403).send({ message: "Unauthorized", success: false });
  }
};

exports.getFavoriteExercise = (req, res) => {
  var token = getToken(req.headers);
  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      return res.status(400).send({
        message: "Bad token",
        success: false,
      });
    }
  });

  if (token) {
    const id = jwt_decode(token).id;
    ExtendedUser.findAll({
      where: {
        id: id,
      },
    })
      .then((data) => {
        var data_object = { data: { data }, success: true };
        res.send(data_object);
      })
      .catch((error) => {
        return res.status(400).send({
          message: "User not recognized",
          success: false,
        });
      });
  } else {
    return res.status(403).send({ message: "Unauthorized", success: false });
  }
};

exports.favoriteExercise = (req, res) => {
  var token = getToken(req.headers);
  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      return res.status(400).send({
        message: "Bad token",
        success: false,
      });
    }
  });

  if (token) {
    const id = jwt_decode(token).id;
    ExtendedUser.findAll({
      where: {
        id: id,
      },
    })
      .then((data) => {
        var current_array = data[0].dataValues.exercise_favorite;
        //If the return is NULL
        if (current_array === null) {
          ExtendedUser.update(
            {
              exercise_favorite: sequelize_function.fn(
                "array_append",
                sequelize_function.col("exercise_favorite"),
                req.params.id
              ),
            },
            {
              where: { id: id },
            }
          )
            .then((data) => {
              res.send({ data: { data }, success: true });
            })
            .catch((err) => {
              return res.status(400).send({
                message: "There has been an error favoriting this exercise",
                success: false,
              });
            });
        }
        //If the current array contains the id
        else if (current_array.includes(req.params.id)) {
          return res.status(400).send({
            message: "You already favorited this exercise",
            success: false,
          });
        } else {
          ExtendedUser.update(
            {
              exercise_favorite: sequelize_function.fn(
                "array_append",
                sequelize_function.col("exercise_favorite"),
                req.params.id
              ),
            },
            {
              where: { id: id },
            }
          )
            .then((data) => {
              res.send({ data: { data }, success: true });
            })
            .catch((err) => {
              return res.status(400).send({
                message: "There has been an error favoriting this exercise",
                success: false,
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).send({
          message: "There has been an error favoriting this exercise",
          success: false,
        });
      });
  } else {
    return res.status(403).send({ message: "Unauthorized", success: false });
  }
};

exports.unfavoriteExercise = (req, res) => {
  var token = getToken(req.headers);
  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      return res.status(400).send({
        message: "Bad token",
        success: false,
      });
    }
  });

  if (token) {
    const id = jwt_decode(token).id;
    ExtendedUser.findAll({
      where: {
        id: id,
      },
    })
      .then((data) => {
        var current_array = data[0].dataValues.exercise_favorite;
        if (current_array === null || !current_array.includes(req.params.id)) {
          return res.status(400).send({
            message: "You can't unfavorite this exercise",
            success: false,
          });
        } else {
          ExtendedUser.update(
            {
              exercise_favorite: sequelize_function.fn(
                "array_remove",
                sequelize_function.col("exercise_favorite"),
                req.params.id
              ),
            },
            {
              where: { id: id },
            }
          )
            .then((data) => {
              res.send({
                data: { data },
                success: true,
              });
            })
            .catch((err) => {
              console.log(err);
              return res.status(400).send({
                message:
                  "There has been an error trying to unfavorite this exercise",
                success: false,
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).send({
          message: "There has been an error trying to unfavorite this exercise",
          success: false,
        });
      });
  } else {
    return res.status(403).send({ message: "Unauthorized", success: false });
  }
};

exports.getWorkout = (req, res) => {
  var token = getToken(req.headers);
  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      return res.status(400).send({
        message: "Bad token",
        success: false,
      });
    }
  });
  if (token) {
    Workout.findByPk(req.params.id)
      .then((data) => {
        res.send({
          id: data.id,
          name: data.name,
          exercise: data.exercise,
          created_by: data.created_by,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({
          message: `Error getting workout by id ${req.params.id}`,
          success: false,
        });
      });
  } else {
    return res.status(403).send({ message: "Unauthorized.", success: false });
  }
};

exports.createWorkout = (req, res) => {
  var correct_keys_workout = ["name", "created_by", "exercise", "public"];
  var correct_keys_exercises = ["name", "type", "type"];
  var correct_keys_details = ["sets", "reps", "rpe"];
  var token = getToken(req.headers);
  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      return res.status(400).send({
        message: "Bad token",
        success: false,
      });
    }
  });

  //Object checking
  if (token) {
    const id = jwt_decode(token).id;
    var workout_obj = req.body.workout;

    //Check Workout Object
    var hasAllKeysWorkout = correct_keys_workout.every((item) =>
      workout_obj.hasOwnProperty(item)
    );

    if (!hasAllKeysWorkout) {
      return res.status(400).send({
        message: "There has been an error with your Object key.",
      });
    }

    //Check Exercise Object
    for (exercise_object of workout_obj["exercise"]) {
      var hasAllKeysExercise = correct_keys_exercises.every((item) =>
        exercise_object.hasOwnProperty(item)
      );
      if (!hasAllKeysExercise) {
        return res.status(400).send({
          message: "There has been an error with your Object key.",
        });
      }

      //Check Details Object
      for (detail_object of exercise_object["details"]) {
        var hasAllKeysDetail = correct_keys_details.every((item) =>
          detail_object.hasOwnProperty(item)
        );
        if (!hasAllKeysDetail) {
          return res.status(400).send({
            message: "There has been an error with your Object key.",
          });
        }
        //Type checking for details object
        for (key in detail_object) {
          if (
            typeof detail_object[key] != "number" ||
            detail_object[key] % 1 != 0
          ) {
            return res.status(400).send({
              message: "There is a type error",
            });
          }
        }
      }
    }

    //Create exercises within Workouts
    // var exercises_id_array = [];

    var exercises_id_array = [];
    for (exercise_obj of workout_obj["exercise"]) {
      var exercise = {
        name: exercise_obj["name"],
        type: exercise_obj["type"],
        details: exercise_obj["details"],
        created_by: id,
      };
      Exercise.create(exercise)
        .then((data) => {
          ExtendedUser.update(
            {
              exercise_create: sequelize_function.fn(
                "array_append",
                sequelize_function.col("exercise_create"),
                data.id
              ),
            },
            {
              where: { id: id },
            }
          )
            .then((update_data) => {
              exercises_id_array.push(data.id);
              console.log(exercises_id_array);
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).send({
                message: "There has been an error creating your workout",
                success: false,
              });
            });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).send({
            message: "There has been an error creating your workout",
            success: false,
          });
        });
    }

    console.log(resolve_data);
    var workout = {
      name: workout_obj["name"],
      public: workout_obj["public"],
      created_by: workout_obj["created_by"],
      exercise: resolve_data,
    };
    Workout.create(workout)
      .then((data) => {
        var success_data = { data: { data }, success: true };
        ExtendedUser.update(
          {
            workout_create: sequelize_function.fn(
              "array_append",
              sequelize_function.col("workout_create"),
              data.id
            ),
          },
          {
            where: { id: id },
          }
        )
          .then((data) => {
            res.send(success_data);
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).send({
              message: "There has been an error creating your workout",
              success: false,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({
          message: "There has been an error creating your workout",
          success: false,
        });
      });
  } else {
    return res.status(403).send({ message: "Unauthorized.", success: false });
  }
};
exports.editWorkout = (req, res) => {};
exports.deleteWorkout = (req, res) => {};
exports.getWorkoutByUser = (req, res) => {};
exports.getFavoriteWorkout = (req, res) => {};
exports.favoriteWorkout = (req, res) => {};
exports.unfavoriteWorkout = (req, res) => {};

// Test API Endpoint
exports.test = (req, res) => {
  var token = getToken(req.headers);
  jwt.verify(token, "nodeauthsecret", function (err, data) {
    if (err) {
      return res.status(400).send({
        message: "Bad token",
        success: false,
      });
    }
  });
  if (token) {
    res.send({ message: "Token is authenticated", success: true });
  } else {
    return res.status(403).send({ message: "Unauthorized", success: false });
  }
};
