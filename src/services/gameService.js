import { Game } from '../models/index.js';

export const listGames = async () => {
  return Game.findAll({
        order: [['id', 'ASC']]
    });
};

export const createGame = async (name) => {
    if (await getGameByName(name)) throw new Error('Game already exist');
    return Game.create({ name });
};

export const getGameById = async (id) => {
    return Game.findByPk(id);
}

export const getGameByName = async (name) => {
    return Game.findOne({ where: { name } });
}

export const updateGameById = async (id, name) => {
    const game = await getGameById(id);
    if (!game) throw new Error('Game Not Found');
    game.name = name;
    await game.save();
    return game;
}

export const destroyGameById = async (id) => {
    const game = await getGameById(id);
    if (!game) throw new Error('Game Not Found');
    return game.destroy();
}