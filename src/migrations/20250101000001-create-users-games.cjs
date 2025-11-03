"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Games
    await queryInterface.createTable("Games", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: Sequelize.STRING(64), allowNull: false, unique: true },
    });

    // Join table
    await queryInterface.createTable("UserGames", {
      UserId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      GameId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "Games", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("UserGames");
    await queryInterface.dropTable("Games");
  },
};
