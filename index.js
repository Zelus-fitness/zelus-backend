require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");

const app = express();

app.use(cors());

//parse requests of application/json
app.use(bodyParser.json());

//parse request of application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//passport requirement
app.user(passport.initialize());
app.use(passport.session());

const db = require("./models");
db.sequelize.sync();

app.get("/", (req, res) => {
  res.json({ message: "Hello!" });
});

require("./routes/routes.js")(app);

const PORT = process.env.BACKEND_PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
