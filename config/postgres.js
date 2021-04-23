const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  host: "localhost",
  dialect: "postgres",
  username: "test",
  password: "test",
  database: "test",
});

const User = sequelize.define("users_jwt", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const sync = async () => {
  await sequelize.sync();
};

sync();

module.exports = { sequelize, User };
