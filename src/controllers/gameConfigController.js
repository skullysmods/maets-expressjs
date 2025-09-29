import GameConfig from '../models/gameConfig.js';

export const getGameConfigById = async (req, res) => {
    const gameConfig = await GameConfig.findOne({
        userId: req.user.id,
        gameId: req.params.id
    }).exec();
    if (gameConfig === null) return res.status(404).json({ error: 'No config for this game' });
    res.json(gameConfig);
};

export const addGameConfigById = async (req, res) => {
    try {
        const gameConfig = await GameConfig.findOne({
            userId: req.user.id,
            gameId: req.params.id
        }).exec();
        if (gameConfig !== null) return res.status(409).json({ error: 'User already have a config for this game' });
        const configData = {
            userId: req.user.id,
            gameId: req.params.id,
            ...req.body
        }
        req.body = configData;
        const game = await GameConfig.create(req.body);
        res.status(201).json(game);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

export const updateGameConfigById = async (req, res) => {
    const gameConfig = await GameConfig.findOneAndUpdate({
        userId: req.user.id,
        gameId: req.params.id
    }, req.body, { new: true, runValidators: true });
    if (!gameConfig) return res.status(404).json({ error: 'Not found' });
    res.json(gameConfig);
};

export const deleteGameConfigById = async (req, res) => {
    const result = await GameConfig.findOneAndDelete({
        userId: req.user.id,
        gameId: req.params.id
    });
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
};