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
        allowNull: false,
      },
      weight: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      imperial: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
