module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  //Sign In
  router.post("/signin", users.signIn);

  //Sign up
  router.post("/signup", users.signUp);

  //Sign out
  router.post("/signout", users.signOut);

  // Return profile information
  router.get("/profile", users.getProfile);

  // Change profile
  router.put("/profile", users.updateProfile);

  //Return exercise by id
  router.get("/exercise/:id", users.getExercise);

  // Create exercise
  router.post("/exercise", users.createExercise);

  // Edit exercise
  router.put("/exercise/:id", users.editExercise);

  // Delete Exercise
  router.delete("/exercise/:id", users.deleteExercise);

  // Return all the exercises based on user ID
  router.get("/user/exercise/",  users.getExerciseByUser)

  // Test JWT and token authorization
  router.get("/test", users.test);

  app.use("/", router);
};
