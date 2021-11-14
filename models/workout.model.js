module.exports = (sequelize, Sequelize) => {
  const Workout = sequelize.define(
    "workout",
    {
      id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.fn('uuid_generate_v4'),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }, 
      exercise: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      public:{
        type: Sequelize.BOOLEAN
      },
      time:{
        type: Sequelize.BIGINT
      },
      created_by:{
        type: Sequelize.STRING
      }
    },
    { timestamps: false }
  );
  return Workout;
};
