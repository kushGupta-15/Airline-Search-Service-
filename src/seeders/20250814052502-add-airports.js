'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('Airports', [
      {
        name: 'Rajmata Vijaya Raje Scindia Airport',
        cityId: 11,
        createdAt: new Date(),
        updatedAt: new Date()
      }, 
      {
        name: 'Lokpriya Gopinath Bordoloi International Airport',
        cityId: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      }, 
      {
        name: 'Sardar Vallabhbhai Patel International Airport',
        cityId: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      }, 
      {
        name: 'Maharaja Agrasen International Airport',
        cityId: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      }, 
      {
        name: 'Shimla Airport',
        cityId: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      }, 
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
