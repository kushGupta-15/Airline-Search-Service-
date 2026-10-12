'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Cities', [
      { id: 1, name: 'Delhi', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Mumbai', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Bengaluru', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Hyderabad', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'Chennai', createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: 'Kolkata', createdAt: new Date(), updatedAt: new Date() },
      { id: 7, name: 'Shimla', createdAt: new Date(), updatedAt: new Date() },
      { id: 8, name: 'Hisar', createdAt: new Date(), updatedAt: new Date() },
      { id: 9, name: 'Ahmedabad', createdAt: new Date(), updatedAt: new Date() },
      { id: 10, name: 'Guwahati', createdAt: new Date(), updatedAt: new Date() },
      { id: 11, name: 'Gwalior', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cities', null, {});
  }
};
