module.exports = (sequelize, Sequelize) => {
  const Program = sequelize.define(
    "program",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('uuid_generate_v4'),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }, 
      workout: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      public:{
        type: Sequelize.BOOLEAN
      },
      created_by:{
        type: Sequelize.STRING
      }
    },
    { timestamps: false }
  );
  return Program;
};
