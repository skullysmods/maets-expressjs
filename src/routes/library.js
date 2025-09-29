import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { User, Game } from '../models/index.js';

const router = Router();

router.get('/', authRequired, async (req, res) => {
    const me = await User.findByPk(req.user.id, { include: Game });
    res.json({
        msg: 'Your games list.', you: {
            id: me.id, email: me.email, games: me.Games.sort((a, b) => a.id - b.id).map(game => ({
                id: game.id,
                name: game.name
            }))
        }
    });
});

router.post('/add', authRequired, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'game name required' });

        const exists = await Game.findOne({ where: { name } });
        if (!exists) return res.status(409).json({ error: 'The Game does not exist' });

        const user = await User.findByPk(req.user.id);
        const game = await Game.findOne({ where: { name: name } });

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
});

router.delete('/delete/:id', authRequired, async (req, res) => {
    const user = await User.findByPk(req.user.id);
    const game = await Game.findByPk(req.params.id);
    if (!game || !user) return res.status(404).json({ error: 'Not found' });
    if (!(await user.hasGame(game))) return res.status(404).json({ error: 'User does not has this game.' });
    await user.removeGame(game);
    res.status(204).end();
});

export default router;
