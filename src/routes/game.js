import { Router } from 'express';
import { authRequired, adminRequired } from '../middlewares/auth.js';
import {
    index,
    show,
    create,
    update,
    destroy
} from '../controllers/gameController.js';

const router = Router();

/**
 * @swagger
 * /games:
 *   get:
 *     tags:
 *       - Game
 *     summary: Récupérer tous les jeux
 *     responses:
 *       200:
 *         description: Liste de tous les jeux
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 games:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Game'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', index);

/**
 * @swagger
 * /games:
 *   post:
 *     tags:
 *       - Game
 *     summary: Créer un nouveau jeu
 *     security:
 *       - bearerAuth: []
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
 *         description: Jeu créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *       400:
 *         description: Nom requis
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: "Accès refusé : Administrateurs uniquement"
 *       409:
 *         description: Jeu déjà existant
 *       500:
 *         description: Erreur serveur
 */
router.post('/', authRequired, adminRequired, create);

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     tags:
 *       - Game
 *     summary: Récupérer un jeu par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Informations du jeu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 game:
 *                   $ref: '#/components/schemas/Game'
 *       404:
 *         description: Jeu non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', show);

/**
 * @swagger
 * /games/{id}:
 *   patch:
 *     tags:
 *       - Game
 *     summary: Modifier un jeu
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Name"
 *     responses:
 *       200:
 *         description: Jeu modifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Nom requis
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: "Accès refusé : Administrateurs uniquement"
 *       404:
 *         description: Jeu non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.patch('/:id', authRequired, adminRequired, update);

/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     tags:
 *       - Game
 *     summary: Supprimer un jeu
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
 *         description: Jeu supprimé
 *       401:
 *         description: Authentification requise
 *       403:
 *         description: "Accès refusé : Administrateurs uniquement"
 *       404:
 *         description: Jeu non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', authRequired, adminRequired, destroy);

export default router;
