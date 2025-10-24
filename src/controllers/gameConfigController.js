import { createGameConfig, deleteGameConfigById, getGameConfigById, updateGameConfigById } from '../services/gameConfigService.js';
import { getGameById } from '../services/gameService.js';
import { getUserById } from '../services/libraryService.js';

export const showGameConfig = async (req, res) => {
    try {
        const user = await getUserById(req.params.userId);
        const game = await getGameById(req.params.gameId);
        if (!user || !game) throw new Error('User or Game Not Found');

        const gameConfig = await getGameConfigById(user.id, game.id);
        if (gameConfig === null) throw new Error('No config for this game');
        res.status(200).json(gameConfig);
    } catch (error) {
        if (error.message === 'User or Game Not Found' || error.message === 'No config for this game') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

export const addGameConfig = async (req, res) => {
    try {
        const user = await getUserById(req.params.userId);
        const game = await getGameById(req.params.gameId);
        if (!user || !game) throw new Error('User or Game Not Found');

        const gameConfig = await getGameConfigById(user.id, game.id);
        if (gameConfig !== null) throw new Error('User already have a config for this game');
        const configData = {
            userId: user.id,
            gameId: game.id,
            ...req.body
        }
        req.body = configData;
        const gameConfigData = await createGameConfig(req.body);
        res.status(201).json(gameConfigData);
    } catch (error) {
        if (error.message === 'User or Game Not Found') {
            res.status(404).json({ error: error.message });
        } else if (error.message === 'User already have a config for this game') {
            res.status(409).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

export const updateGameConfig = async (req, res) => {
    try {
        const user = await getUserById(req.params.userId);
        const game = await getGameById(req.params.gameId);
        if (!user || !game) throw new Error('User or Game Not Found');

        const gameConfig = await updateGameConfigById(user.id, game.id, req.body);
        if (gameConfig === null) throw new Error('No config for this game');
        res.status(200).json(gameConfig);
    } catch (error) {
        if (error.message === 'User or Game Not Found' || error.message === 'No config for this game') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

export const deleteGameConfig = async (req, res) => {
    try {
        const user = await getUserById(req.params.userId);
        const game = await getGameById(req.params.gameId);
        if (!user || !game) throw new Error('User or Game Not Found');

        const result = await deleteGameConfigById(user.id, game.id);
        if (result === null) throw new Error('No config for this game');
        res.status(204).end();
    } catch (error) {
        if (error.message === 'User or Game Not Found' || error.message === 'No config for this game') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
    
};