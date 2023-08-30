const { sequelize } = require("../database/postgres/config")
const { DataTypes, Model } = require('sequelize');

const { Account } = require('./accountRepository');

class Transaction extends Model { }

Transaction.init({
  fromAccountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Accounts', 
      key: 'id'
    }
  },
  toAccountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Accounts',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  transferredAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date()
  }
}, {
  sequelize,
  modelName: 'Transaction'
});

Transaction.belongsTo(Account, { foreignKey: 'fromAccountId', as: 'fromAccount' });
Transaction.belongsTo(Account, { foreignKey: 'toAccountId', as: 'toAccount' });

const TransactionRepository = {

  async create(transactionData) {
    return await Transaction.create(transactionData);
  },

  async getTransactionsById({ accountId, page = 1, size = 5 }) {

    const where = { fromAccountId: accountId };
    const offset = (page - 1) * size;
    const limit = size;
    const include = ['fromAccount', 'toAccount']
    const paginate = await Transaction.findAndCountAll({ where, offset, limit, include });
    return {
      pages: Math.ceil(paginate.count / size),
      totalPage: paginate.count / size,
      totalItems: paginate.count,
      currentPage: page,
      transactions: paginate.rows.map(transaction => transaction?.toJSON())
    }
  }
}

module.exports = { Transaction, TransactionRepository };
