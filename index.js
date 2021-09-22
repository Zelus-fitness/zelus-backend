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
app.use(passport.initialize());
app.use(passport.session());

const db = require("./models");
db.sequelize.sync();

//drop the table if it already exists
db.sequelize.sync({force:true}).then(()=>{
  console.log("Drop and resync the DB")
})


app.get("/", (req, res) => {
  res.json({ message: "Hello!" });
});

require("./routes/routes.js")(app);

const PORT = process.env.BACKEND_PORT || 6969;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
