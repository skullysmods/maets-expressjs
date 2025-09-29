import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { Game } from '../models/index.js';

const router = Router();

router.get('/', async (req, res) => {
    const games = await Game.findAll({
        order: [['id', 'ASC']]
    });
    res.json({ msg: 'All games.', games: games });
});

router.get('/show/:id', async (req, res) => {
    const game = await Game.findByPk(req.params.id);
    res.json({ msg: 'Game information', game: game });
});

router.post('/create', authRequired, async (req, res) => {
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
});

router.patch('/edit/:id', authRequired, async (req, res) => {
    const { name } = req.body;
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ error: 'Not found' });
    game.name = name;
    await game.save();
    res.json(game);
});

router.delete('/delete/:id', authRequired, async (req, res) => {
    const result = await Game.findByPk(req.params.id);
    if (!result) return res.status(404).json({ error: 'Not found' });
    await result.destroy();
    res.status(204).end();
});

export default router;
