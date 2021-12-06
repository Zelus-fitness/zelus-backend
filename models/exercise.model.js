module.exports = (sequelize, Sequelize) => {
  const Exercise = sequelize.define(
    "exercise",
    {
      id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.fn("uuid_generate_v4"),
        primaryKey: true,
        allowNull: false,
      },
      details: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE(3),
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(3)"),
      },
    },
    { timestamps: false }
  );
  return Exercise;
};
