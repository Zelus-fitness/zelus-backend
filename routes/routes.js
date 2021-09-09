module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  //Sign In
  router.post("/signin", users.signIn);

  //Sign up
  router.post("/signup", users.signUp);

  //Sign out
  router.post("/signout", users.signOut);

  //
  router.get("/test", users.test)

  app.use("/", router);
};
