module.exports = (sequelize, Sequelize) => {
  const ExtendedUser = sequelize.define(
    "extended_user",
    {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      height: {
        type: Sequelize.STRING,
      },
      weight: {
        type: Sequelize.BIGINT,
      },
      imperial: {
        type: Sequelize.BOOLEAN,
      },
      age: {
        type: Sequelize.INTEGER,
      },
      profile_picture: {
        type: Sequelize.STRING,
        defautlt: "temp profile picture",
      },
      exercise_favorite: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      workout_favorite: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      exercise_create: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      workout_create: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
    },
    { timestamps: false }
  );
  return ExtendedUser;
};
