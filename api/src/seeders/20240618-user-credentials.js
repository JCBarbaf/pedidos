'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_credentials', [
      {
        id: 1,
        userId: '1',
        email: 'jcbarbaf@gmail.com',
        password: '$2a$08$q5bL1tw4alFpKvIbe2meZuVRd9/kWMk4gvPdRWtv96E5CAT8YBZHS',
        lastPasswordChange: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_credentials', null, {})
  }
}