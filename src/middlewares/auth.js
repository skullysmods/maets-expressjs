import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { User, Role } from '../models/index.js';

export function authRequired(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // { id, email }
        return next();
    } catch (e) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

export async function adminRequired(req, res, next) {
    try {
        const user = await User.findByPk(req.user.id, { include: Role });
        const isAdmin = user.Roles.some(role => role.name === 'admin');
        if (!isAdmin) return res.status(403).json({ message: 'Access denied: Admins only.' });
        return next();
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'check_admin_failed' });
    }
}
