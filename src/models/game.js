import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class Game extends Model { }
    Game.init(
        {
            id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
            name: { type: DataTypes.STRING(64), allowNull: false, unique: true }
        },
        { sequelize, modelName: 'Game', tableName: 'Games', timestamps: false }
    );
    return Game;
};
