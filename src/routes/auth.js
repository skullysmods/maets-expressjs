import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Role } from "../models/index.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Enregistrer un utilisateur
 *     description: Inscription d'un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user"]
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 123456
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["user"]
 *       400:
 *         description: Email & password required
 *       409:
 *         description: Email already in use
 *       500:
 *         description: Registration failed
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, roles = ["user"] } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email & password required" });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });

    const roleRows = await Role.findAll({ where: { name: roles } });
    await user.setRoles(roleRows);

    res
      .status(201)
      .json({
        id: user.id,
        email: user.email,
        roles: roleRows.map((r) => r.name),
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "registration_failed" });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Authentifier un utilisateur
 *     description: |
 *       Connexion d'un utilisateur existant.
 *       Tips : Le token retourné peut être utilisé pour accéder aux routes protégées via le bouton "Authorize" de l'interface Swagger.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 123456
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["user"]
 *       400:
 *         description: Email & password required
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Échec de la connexion
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email & password required" });

    const user = await User.findOne({ where: { email }, include: Role });
    if (!user) return res.status(401).json({ error: "invalid_credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "invalid_credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        roles: user.Roles?.map((r) => r.name) || [],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "login_failed" });
  }
});

export default router;
