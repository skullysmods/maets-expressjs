import { Router } from 'express';
import { authRequired, adminRequired } from '../middlewares/auth.js';
import {
    getUserGames,
    addGameToLib,
    removeGameToLib
} from '../controllers/libraryController.js';

const router = Router();

router.get('/', authRequired, getUserGames);
router.post('/add/user/:userId/game/:gameId', authRequired, adminRequired, addGameToLib);
router.delete('/:id', authRequired, removeGameToLib);

export default router;
