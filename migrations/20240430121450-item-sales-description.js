"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("items", "sales_description", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.bulkUpdate(
      "items",
      {
        sales_description: "This is a sales description",
      },
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("items", "sales_description");
  },
};
