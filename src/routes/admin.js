import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { User, Role, Game } from '../models/index.js';

const router = Router();

router.post('/add/user/:userId/game/:gameId', authRequired, async (req, res) => {
    try {
        const connectedUser = await User.findByPk(req.user.id, { include: Role });
        const isAdmin = connectedUser.Roles.some(role => role.name === 'admin');

        if (!isAdmin) return res.status(403).json({ error: 'Access denied: Admins only.' });

        const user = await User.findByPk(req.params.userId);
        const game = await Game.findByPk(req.params.gameId);

        if (!user || !game) return res.status(404).json({ error: 'Not found' });

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

export default router;
