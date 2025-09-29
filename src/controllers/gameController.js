import { Game } from '../models/index.js';

export const getAllGames = async (req, res) => {
    const games = await Game.findAll({
        order: [['id', 'ASC']]
    });
    res.json({ msg: 'All games.', games: games });
};

export const getGameById = async (req, res) => {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ error: 'Not found' });
    res.json({ msg: 'Game information', game: game });
};

export const createGame = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'name required' });

        const exists = await Game.findOne({ where: { name } });
        if (exists) return res.status(409).json({ error: 'Game already exist' });

        const game = await Game.create({ name });

        res.status(201).json({ id: game.id, name: game.name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'game_add_failed' });
    }
};

export const editGame = async (req, res) => {
    const { name } = req.body;
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ error: 'Not found' });
    game.name = name;
    await game.save();
    res.json(game);
};

export const deleteGame = async (req, res) => {
    const result = await Game.findByPk(req.params.id);
    if (!result) return res.status(404).json({ error: 'Not found' });
    await result.destroy();
    res.status(204).end();
};