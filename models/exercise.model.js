module.exports = (sequelize, Sequelize) => {
  const Exercise = sequelize.define(
    "exercise",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      public: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      sets: {
        type: Sequelize.INTEGER,
      },
      reps: {
        type: Sequelize.INTEGER,
      },
      rpe: {
        type: Sequelize.INTEGER,
      },
      created_by: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    { timestamps: false }
  );
  return Exercise;
};
