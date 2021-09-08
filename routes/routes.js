module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  //Log in
  router.post("/login", users.logIn);

  //Sign up
  router.post("/signup", users.signUp);

  //Log out
  router.post("/logout", users.logOut);

  app.use("/", router);
};
