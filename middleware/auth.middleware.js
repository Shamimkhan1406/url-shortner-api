import { verifyUserToken } from '../utils/token.js';

export function authMiddleware(req, res, next){
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(400).json({ message: 'Authorization header missing' });
    }
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(400).json({ message: 'Invalid authorization header format' });
    }
    const token = authHeader.split(' ')[1];
    const payload = verifyUserToken(token);

    req.user = payload;
    next();
}