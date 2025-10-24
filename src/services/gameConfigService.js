import GameConfig from '../models/gameConfig.js';

export const getGameConfigById = async (userId, gameId) => {
    return GameConfig.findOne({ userId: userId, gameId: gameId }).exec();
}

export const createGameConfig = async (data) => {
    return GameConfig.create(data);
}

export const updateGameConfigById = async (userId, gameId, data) => {
    return GameConfig.findOneAndUpdate({ userId: userId, gameId, gameId }, data, { new: true, runValidators: true });
}

export const deleteGameConfigById = async (userId, gameId) => {
    return GameConfig.findOneAndDelete({userId: userId, gameId: gameId});
}