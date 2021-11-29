require("dotenv").config();

const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const passport = require("passport");

const app = express();

app.use(cors());

//parse requests of application/json
app.use(express.json());

//parse request of application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//passport requirement
app.use(passport.initialize());
app.use(passport.session());

const db = require("./models");
db.sequelize.sync();

// Uncomment this code if changed any of the table schemas
// This will delete all of your data and reinitialize your tables
db.sequelize.sync({force:true}).then(()=>{
  console.log("Drop and resync the DB")
})

app.get("/", (req, res) => {
  res.json({ message: "Hello!" });
});

require("./routes/routes.js")(app);

// var key = fs.readFileSync("./selfsigned.key");
// var cert = fs.readFileSync("./selfsigned.crt");
// var options = {
//   key: key,
//   cert: cert,
// };

const PORT = process.env.PORT;

// var server = https.createServer(options, app);

app.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});
