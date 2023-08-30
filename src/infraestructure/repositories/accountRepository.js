const { sequelize } = require("../database/postgres/config")
const { DataTypes, Model } = require('sequelize');

const { User } = require('./userRepository');

let modelName = 'Account';
let referenceName = 'Users';

if (process.env.NODE_ENV === 'test') {
  modelName = 'Account_Test';
  referenceName = 'User_Tests';
}

class Account extends Model { }

Account.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: referenceName,
      key: 'id'
    }
  },
  accountType: {
    type: DataTypes.ENUM('Savings', 'Current', 'BasicSavings'),
    allowNull: false
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('OPEN', 'CLOSED'),
    allowNull: false,
    defaultValue: 'OPEN'
  }
}, {
  sequelize,
  modelName
});

const AccountRepository = {
  async findByUserId(userId) {
    return (await Account.findAll({ where: { userId, status: "OPEN" } })).map(account => account?.toJSON());
  },

  async create(accountData) {
    return await Account.create(accountData);
  },

  async closeAccount(userId, accountId) {
    return await Account.update({ status: 'CLOSED' }, { where: { userId: userId, id: accountId } });
  },

  async findByTypeAccount({ accountType, userId }) {
    const res = await Account.findOne({ where: { accountType, userId } });
    return res
  },

  async findByTypeAccountId(accountId) {
    return await Account.findOne({ where: { id: accountId, status: "OPEN" } })
  },

  async isOwner({ fromAccountId, userId }) {
    const account = await Account.findOne({ where: { id: fromAccountId, userId } })
    if (account?.userId == userId) return true
    return false
  },

  async updateAccountBalance(accountId, newBalance) {
    return await Account.update({ balance: newBalance }, { where: { id: accountId } });
  },

  async findAllByType(type) {
    return await Account.findAll({ where: { accountType: type } })
  },

  async update(accountId, { balance }) {
    return await Account.update({ balance }, { where: { id: accountId, status: "OPEN" } });
  },

  async updateAccountStatus(accountId, status) {
    return await Account.update({ status }, { where: { id: accountId } });
  }


};

User.hasMany(Account, { foreignKey: 'userId', as: 'accounts' });
Account.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { Account, AccountRepository };