const { Sequelize, DataTypes } = require("sequelize");

// Connection info -
const sequelize = new Sequelize({
  host: "localhost",
  dialect: "postgres",
  username: "test",
  password: "test",
  database: "test",
});

const User = sequelize.define("people", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  // normally we wouldn't store passwords directly, we would store their hashes.
  // crypto libraray is commonly used to do so.
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// express-session uses this table to store session.
const Session = sequelize.define(
  "sessions",
  {
    //   Following 3 properties are needed in session.
    sid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    sess: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    expire: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    /*
      Below two are automatically created by sequelize and these two do not support null values.
      So when passport tries to store a session it gives an error.
      So we explicitly tell Sequelize to have null values in these.
    */
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    // index for faster searching.
    indexes: [
      {
        fields: ["expire"],
      },
    ],
  }
);

const sync = async () => {
  await sequelize.sync(); // sync with database.
};

sync();

module.exports = { sequelize, User, Session };
