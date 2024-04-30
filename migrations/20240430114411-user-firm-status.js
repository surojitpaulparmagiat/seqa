'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('firms', 'status', {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
    });


    await queryInterface.addColumn('user_firms', 'status', {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,

    });


  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('firms', 'status');
    await queryInterface.removeColumn('user_firms', 'status');
  }
};
