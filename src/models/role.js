import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class Role extends Model { }
    Role.init(
        {
            id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
            name: { type: DataTypes.STRING(64), allowNull: false, unique: true }
        },
        { sequelize, modelName: 'Role', tableName: 'Roles', timestamps: false }
    );
    return Role;
};
