import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class User extends Model { }
  User.init(
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING(191), allowNull: false, unique: true, validate: { isEmail: true } },
      passwordHash: { type: DataTypes.STRING(100), allowNull: false }
    },
    { sequelize, modelName: 'User', tableName: 'Users', timestamps: true, underscored: false }
  );
  return User;
};
