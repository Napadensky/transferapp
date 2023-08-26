const { sequelize } = require("../database/postgres/config")
const { DataTypes, Model } = require('sequelize');

class User extends Model { }

User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'USER'),
    allowNull: false,
    defaultValue: 'USER'
  }
}, {
  sequelize,
  modelName: 'User'
});

const UserRepository = {
  async findByUsername(username) {
    return await User.findOne({ where: { username } });
  },

  async create(userData) {
    return await User.create(userData);
  },

};

module.exports = { User, UserRepository };
