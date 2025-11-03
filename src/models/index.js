import { sequelize } from '../config/db/mariadb.js';
import userFactory from './user.js';
import roleFactory from './role.js';
import gameFactory from './game.js';
import { DataTypes } from 'sequelize';

const User = userFactory(sequelize);
const Role = roleFactory(sequelize);
const Game = gameFactory(sequelize);

// Many-to-Many via UserRoles
const UserRoles = sequelize.define('UserRoles', {
  UserId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  RoleId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
}, { tableName: 'UserRoles', timestamps: false });

// Many-to-Many via UserGames
const UserGames = sequelize.define('UserGames', {
  UserId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  GameId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false }
}, { tableName: 'UserGames', timestamps: false });

User.belongsToMany(Role, { through: UserRoles, foreignKey: 'UserId' });
Role.belongsToMany(User, { through: UserRoles, foreignKey: 'RoleId' });

User.belongsToMany(Game, { through: UserGames, foreignKey: 'UserId' });
Game.belongsToMany(User, { through: UserGames, foreignKey: 'GameId' });

export { sequelize, User, Role, Game, UserRoles, UserGames };
