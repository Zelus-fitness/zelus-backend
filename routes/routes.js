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

  //Return one exercise by id
  router.get("/exercise/:id", users.getExercise);

  // Create exercise
  router.post("/exercise", users.createExercise);

  // Edit exercise
  router.put("/exercise/:id", users.editExercise);

  // Delete Exercise
  router.delete("/exercise/:id", users.deleteExercise);

  // Return all exercises based on user ID
  router.get("/user/exercise/", users.getExerciseByUser);

  // Gets which exercises were favorited based on user ID
  router.get("/favoriteexercise", users.getFavoriteExercise);

  // Favorites an exercise, :id url is exercise url
  router.post("/favoriteexercise/:id", users.favoriteExercise);

  // Unfavorites Exercise, :id url is exercise url
  router.post("/unfavoriteexercise/:id", users.unfavoriteExercise);

  //Return one workout by id
  router.get("/workout/:id", users.getWorkout);

  // Create workout
  router.post("/workout", users.createWorkout);

  // Edit workout
  router.put("/workout/:id", users.editWorkout);

  // Delete workout
  router.delete("/workout/:id", users.deleteWorkout);

  // Return all workouts based on user ID
  router.get("/user/workout/", users.getWorkoutByUser);

  // Gets which workout were favorited based on user ID
  router.get("/getfavoriteworkout", users.getFavoriteWorkout);

  // Favorites an workout, ":id" in the url is workout ID
  router.post("/favoriteworkout/:id", users.favoriteWorkout);

  // Unfavorites workout, :id" in the url is workout ID
  router.post("/unfavoriteworkout/:id", users.unfavoriteWorkout);

  // Test JWT and token authorization
  router.get("/test", users.test);

  app.use("/", router);
};
