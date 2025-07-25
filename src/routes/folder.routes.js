import { Router } from 'express';
import { createFolder, getFolders } from '../controllers/folder.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/', auth, createFolder);
router.get('/', auth, getFolders);

export default router;
