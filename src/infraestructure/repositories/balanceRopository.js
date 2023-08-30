const { sequelize } = require("../database/postgres/config")
const { DataTypes, Model } = require('sequelize');
const { Account } = require("./accountRepository");

class Balance extends Model { }

Balance.init({
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  beforeBalance: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  afterBalance: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lastUpdate: {
    type: DataTypes.DATE,
    allowNull: false
  }

}, {
  sequelize,
  modelName: 'Balance'
});

Balance.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });

const BalanceRepository = {
  async findByAccountId({ accountId, page = 1, size = 5 }) {
    const where = { accountId };
    const offset = (page - 1) * size;
    const limit = size;
    const paginate = await Balance.findAndCountAll({ where, offset, limit });
    const hasData = paginate.rows.length > 0;
    return {
      pages: Math.ceil(paginate.count / size),
      totalPage: paginate.count / size,
      totalItems: paginate.count,
      currentPage: page,
      balances: hasData ? paginate.rows.map(balance => balance?.toJSON()) : []
    }
  },

  async create(balanceData) {
    return await Balance.create(balanceData);
  },

};

module.exports = { Balance, BalanceRepository };
