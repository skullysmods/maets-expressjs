import { Router } from 'express';
import { authRequired, adminRequired } from '../middlewares/auth.js';
import {
    getUserGames,
    addGameToLib,
    removeGameToLib
} from '../controllers/libraryController.js';

const router = Router();

/**
 * @swagger
 * /users/{id}/library:
 *   get:
 *     tags:
 *       - Library
 *     summary: Récupérer la liste des jeux de l'utilisateur connecté
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
router.get('/:id/library', authRequired, getUserGames);

/**
 * @swagger
 * /users/{id}/library:
 *   post:
 *     tags:
 *       - Library
 *     summary: Ajouter un jeu à la bibliothèque d'un utilisateur
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
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Chess"
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
router.post('/:id/library', authRequired, adminRequired, addGameToLib);

/**
 * @swagger
 * /users/{userId}/library/{gameId}:
 *   delete:
 *     tags:
 *       - Library
 *     summary: Retirer un jeu de la bibliothèque de l'utilisateur connecté
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
 *         description: Jeu retiré
 *       401:
 *         description: Authentification requise
 *       404:
 *         description: Jeu ou utilisateur non trouvé, ou l'utilisateur ne possède pas ce jeu
 */
router.delete('/:userId/library/:gameId', authRequired, removeGameToLib);

export default router;
