//Connect postgres database using a config file
const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  dialectOptions: {
    ssl: {
      require: true, 
      rejectUnauthorized: false 
    }
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  logging: false,
});

//Database models and sequelize functions will be put into an object so it can be exported
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.extendeduser = require("./extendeduser.model.js")(sequelize, Sequelize);
db.program = require("./program.model.js")(sequelize, Sequelize);
db.workout = require("./workout.model.js")(sequelize, Sequelize);
db.exercise = require("./exercise.model.js")(sequelize, Sequelize);

module.exports = db;
