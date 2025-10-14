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

/**
 * @swagger
 * /library:
 *   get:
 *     tags:
 *       - Library
 *     summary: Récupérer la liste des jeux de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des jeux de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 you:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     games:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Game'
 */
router.get('/', authRequired, getUserGames);

/**
 * @swagger
 * /library/add/user/{userId}/game/{gameId}:
 *   post:
 *     tags:
 *       - Library
 *     summary: Ajouter un jeu à la bibliothèque d'un utilisateur
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
 *       201:
 *         description: Jeu ajouté à la bibliothèque
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 game:
 *                   $ref: '#/components/schemas/Game'
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: "Accès refusé : Administrateurs uniquement"
 *       404:
 *         description: Utilisateur ou jeu non trouvé
 *       409:
 *         description: L'utilisateur possède déjà ce jeu
 *       500:
 *         description: Erreur lors de l'ajout ou vérification admin
 */
router.post('/add/user/:userId/game/:gameId', authRequired, adminRequired, addGameToLib);

/**
 * @swagger
 * /library/{id}:
 *   delete:
 *     tags:
 *       - Library
 *     summary: Retirer un jeu de la bibliothèque de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Jeu retiré
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Jeu ou utilisateur non trouvé, ou l'utilisateur ne possède pas ce jeu
 */
router.delete('/:id', authRequired, removeGameToLib);

/**
 * @swagger
 * /library/{id}/config:
 *   get:
 *     tags:
 *       - GameConfig
 *     summary: Récupérer la configuration d'un jeu pour l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
router.get('/:id/config', authRequired, getGameConfigById);

/**
 * @swagger
 * /library/{id}/config:
 *   post:
 *     tags:
 *       - GameConfig
 *     summary: Ajouter une configuration pour un jeu de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
router.post('/:id/config', authRequired, addGameConfigById);

/**
 * @swagger
 * /library/{id}/config:
 *   patch:
 *     tags:
 *       - GameConfig
 *     summary: Modifier la configuration d'un jeu pour l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
router.patch('/:id/config', authRequired, updateGameConfigById);

/**
 * @swagger
 * /library/{id}/config:
 *   delete:
 *     tags:
 *       - GameConfig
 *     summary: Supprimer la configuration d'un jeu pour l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
router.delete('/:id/config', authRequired, deleteGameConfigById);

export default router;
