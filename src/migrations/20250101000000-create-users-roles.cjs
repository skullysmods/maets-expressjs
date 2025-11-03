'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Users
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      email: { type: Sequelize.STRING(191), allowNull: false, unique: true },
      passwordHash: { type: Sequelize.STRING(100), allowNull: false },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // Roles
    await queryInterface.createTable("Roles", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: Sequelize.STRING(64), allowNull: false, unique: true },
    });

    // Join table
    await queryInterface.createTable("UserRoles", {
      UserId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      RoleId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "Roles", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });

    // Seed a couple of roles (optional but handy)
    await queryInterface.bulkInsert("Roles", [
      { name: "user" },
      { name: "admin" },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("UserRoles");
    await queryInterface.dropTable("Roles");
    await queryInterface.dropTable("Users");
  },
};
