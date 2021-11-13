module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.fn('uuid_generate_v4'),
        primaryKey: true,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
      },
      email_address: {
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
      },
      created_datetime: {
        type: Sequelize.BIGINT,
      },
    },
    { timestamps: false }
  );
  return User;
};
