module.exports = (sequelize, Sequelize) => {
  const ExtendedUser = sequelize.define(
    "extended_user",
    {
      // id: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      // },
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
    },
    { timestamps: false }
  );
  return ExtendedUser;
};
