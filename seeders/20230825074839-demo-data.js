'use strict';

const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const fs = require('fs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const demoUsers = [];
    const demoUsersSave = [];
    for (let i = 1; i <= 10; i++) {
      const name = faker.internet.userName()
      const pass = faker.internet.password() 
      demoUsersSave.push({ name, pass })

      demoUsers.push({
        id: i,
        username: name,
        password: await bcrypt.hash(pass, 10),
        role: faker.helpers.arrayElement(['ADMIN', 'USER']),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    fs.writeFileSync('demoUsers.json', JSON.stringify(demoUsersSave, null, 2));

    await queryInterface.bulkInsert('Users', demoUsers);


    const demoAccounts = [];
    for (let i = 0; i < 20; i++) {
      demoAccounts.push({
        id: i + 1, 
        userId: faker.helpers.arrayElement(demoUsers).id,
        accountType: faker.helpers.arrayElement(['Savings', 'Current', 'BasicSavings']),
        balance: parseFloat(faker.finance.amount()),
        status: faker.helpers.arrayElement(['OPEN', 'CLOSED']),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await queryInterface.bulkInsert('Accounts', demoAccounts);

    const demoBalances = [];
    for (let i = 0; i < 40; i++) {
      const beforeBalance = faker.finance.amount();
      const amount = faker.finance.amount();
      demoBalances.push({
        accountId: faker.helpers.arrayElement(demoAccounts).id,
        beforeBalance: parseInt(faker.finance.amount()).toFixed(2),
        amount: parseInt(faker.finance.amount()).toFixed(2),
        afterBalance: parseInt(parseFloat(beforeBalance) + parseFloat(amount)).toFixed(2),
        lastUpdate: faker.date.recent(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await queryInterface.bulkInsert('Balances', demoBalances);

    const demoTransactions = [];
    for (let i = 0; i < 30; i++) {
      const fromAccount = faker.helpers.arrayElement(demoAccounts);
      const toAccount = faker.helpers.arrayElement(demoAccounts);
      const amount = faker.finance.amount();
      demoTransactions.push({
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        amount: amount,
        transferredAt: faker.date.recent(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await queryInterface.bulkInsert('Transactions', demoTransactions);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Accounts', null, {});
    await queryInterface.bulkDelete('Transactions', null, {});
    await queryInterface.bulkDelete('Balances', null, {});
  }
};
