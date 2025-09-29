import jwt from 'jsonwebtoken';
import 'dotenv/config';

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
