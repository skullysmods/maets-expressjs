import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';

import {
    showGameConfig,
    addGameConfig,
    updateGameConfig,
    deleteGameConfig
} from '../controllers/gameConfigController.js'

const router = Router();

/**
 * @swagger
 * /users/{userId}/library/{gameId}/config:
 *   get:
 *     tags:
 *       - GameConfig
 *     summary: Récupérer la configuration d'un jeu pour l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuration du jeu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameConfig'
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Pas de configuration pour ce jeu
 */
router.get('/:userId/library/:gameId/config', authRequired, showGameConfig);

/**
 * @swagger
 * /users/{userId}/library/{gameId}/config:
 *   post:
 *     tags:
 *       - GameConfig
 *     summary: Ajouter une configuration pour un jeu de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameConfig'
 *     responses:
 *       201:
 *         description: Configuration ajoutée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameConfig'
 *       401:
 *         description: Authentification requise
 *       409:
 *         description: L'utilisateur a déjà une configuration pour ce jeu
 *       400:
 *         description: Erreur de validation
 */
router.post('/:userId/library/:gameId/config', authRequired, addGameConfig);

/**
 * @swagger
 * /users/{userId}/library/{gameId}/config:
 *   patch:
 *     tags:
 *       - GameConfig
 *     summary: Modifier la configuration d'un jeu pour l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameConfig'
 *     responses:
 *       200:
 *         description: Configuration modifiée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameConfig'
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Configuration non trouvée
 */
router.patch('/:userId/library/:gameId/config', authRequired, updateGameConfig);

/**
 * @swagger
 * /users/{userId}/library/{gameId}/config:
 *   delete:
 *     tags:
 *       - GameConfig
 *     summary: Supprimer la configuration d'un jeu pour l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Configuration supprimée
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Configuration non trouvée
 */
router.delete('/:userId/library/:gameId/config', authRequired, deleteGameConfig);

export default router;