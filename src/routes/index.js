import { Router } from 'express';
import authRoutes from './auth.js';
import gameRoutes from './game.js';
import libraryRoutes from './library.js';
import adminRoutes from './admin.js';

const router = Router();

router.get('/', (req, res) => {
    res.json({ ok: true, msg: 'Welcome to Maets !' });
});

router.use('/auth', authRoutes);
router.use('/game', gameRoutes);
router.use('/library', libraryRoutes);
router.use('/admin', adminRoutes);

export default router;
