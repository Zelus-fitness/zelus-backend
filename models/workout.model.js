module.exports = (sequelize, Sequelize) => {
  const Workout = sequelize.define(
    "workout",
    {
      id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      exercise: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      public: {
        type: Sequelize.BOOLEAN,
      },
      time: {
        type: Sequelize.BIGINT,
      },
      notes: {
        type: Sequelize.STRING,
      },
      created_by: {
        type: Sequelize.STRING,
      },
      created_at: {
        type: Sequelize.DATE(3),
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(3)"),
      },
    },
    { timestamps: false }
  );
  return Workout;
};
