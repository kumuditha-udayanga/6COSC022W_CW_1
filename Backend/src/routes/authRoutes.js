import express from 'express';
import {register, login, logout, deleteApiKey, createNewApiKey} from '../controllers/authController.js';
import {requireAuth} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.post("/generateNewKey/:userId", requireAuth, createNewApiKey);

router.delete('/deleteKey', requireAuth, deleteApiKey);

export default router;
