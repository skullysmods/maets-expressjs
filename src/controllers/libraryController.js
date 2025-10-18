import { User, Game } from '../models/index.js';

export const getUserGames = async (req, res) => {
    const me = await User.findByPk(req.user.id, { include: Game });
    res.json({
        msg: 'Your games list.', you: {
            id: me.id, email: me.email, games: me.Games.sort((a, b) => a.id - b.id).map(game => ({
                id: game.id,
                name: game.name
            }))
        }
    });
};

//TODO: support multiple game
export const addGameToLib = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId);
        const game = req.body.name;
        console.log(game);

        if (!user || !game) return res.status(404).json({ error: 'User or Game Not found' });

        if (await user.hasGame(game)) return res.status(409).json({ error: 'User already own this game' });
        await user.addGame(game);

        res.status(201).json({
            userId: user.id, game: {
                id: game.id,
                name: game.name
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'lib_add_failed' });
    }
};

export const removeGameToLib = async (req, res) => {
    const user = await User.findByPk(req.user.id);
    const game = await Game.findByPk(req.params.id);
    if (!game || !user) return res.status(404).json({ error: 'Not found' });
    if (!(await user.hasGame(game))) return res.status(404).json({ error: 'User does not has this game.' });
    await user.removeGame(game);
    res.status(204).end();
};