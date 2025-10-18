import { Router } from 'express';
import authRoutes from './auth.js';
import gameRoutes from './game.js';
import userRoutes from './user.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from '../config/swaggerOptions.js';

const router = Router();
const swaggerSpec = swaggerJsdoc(swaggerOptions);

router.get('/', (req, res) => {
    res.json({ ok: true, msg: 'Welcome to Maets !' });
});

router.use('/auth', authRoutes);
router.use('/games', gameRoutes);
router.use('/users', userRoutes);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
