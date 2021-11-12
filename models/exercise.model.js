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
    },
    { timestamps: false }
  );
  return Exercise;
};
