import { Router } from 'express';
import { authRequired, adminRequired } from '../middlewares/auth.js';
import {
    getAllGames,
    getGameById,
    createGame,
    editGame,
    deleteGame
} from '../controllers/gameController.js';

const router = Router();

router.get('/', getAllGames);
router.post('/', authRequired, adminRequired, createGame);
router.get('/:id', getGameById);
router.patch('/:id', authRequired, adminRequired, editGame);
router.delete('/:id', authRequired, adminRequired, deleteGame);

export default router;
