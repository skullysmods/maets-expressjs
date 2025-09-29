import { Router } from 'express';
import { authRequired, adminRequired } from '../middlewares/auth.js';
import {
    getUserGames,
    addGameToLib,
    removeGameToLib
} from '../controllers/libraryController.js';
import {
    getGameConfigById,
    addGameConfigById,
    updateGameConfigById,
    deleteGameConfigById
} from '../controllers/gameConfigController.js'

const router = Router();

// Library routes
router.get('/', authRequired, getUserGames);
router.post('/add/user/:userId/game/:gameId', authRequired, adminRequired, addGameToLib);
router.delete('/:id', authRequired, removeGameToLib);
// Game config routes
router.get('/:id/config', authRequired, getGameConfigById);
router.post('/:id/config', authRequired, addGameConfigById);
router.patch('/:id/config', authRequired, updateGameConfigById);
router.delete('/:id/config', authRequired, deleteGameConfigById);

export default router;
