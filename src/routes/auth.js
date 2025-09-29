import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Role } from '../models/index.js';

const router = Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, roles = ['user'] } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'email & password required' });

        const exists = await User.findOne({ where: { email } });
        if (exists) return res.status(409).json({ error: 'Email already in use' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ email, passwordHash });

        const roleRows = await Role.findAll({ where: { name: roles } });
        await user.setRoles(roleRows);

        res.status(201).json({ id: user.id, email: user.email, roles: roleRows.map(r => r.name) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'registration_failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'email & password required' });

        const user = await User.findOne({ where: { email }, include: Role });
        if (!user) return res.status(401).json({ error: 'invalid_credentials' });

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ error: 'invalid_credentials' });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                roles: user.Roles?.map(r => r.name) || []
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'login_failed' });
    }
});

export default router;
