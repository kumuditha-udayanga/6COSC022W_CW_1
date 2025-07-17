import { sessions } from '../controllers/authController.js';

export const requireAuth = (req, res, next) => {
    const apiKey = req.cookies.apiKey;
    if (apiKey && sessions[apiKey]) {
        req.userId = sessions[apiKey];
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};
