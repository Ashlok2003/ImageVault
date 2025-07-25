import { Router } from 'express';
import { signup, login, logout, me } from '../controllers/auth.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/me', auth, me);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', auth, logout);

export default router;
