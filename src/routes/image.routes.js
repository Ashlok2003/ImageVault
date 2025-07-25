import express from 'express';
import { uploadImage, getImages, searchImages } from '../controllers/image.controller.js';
import auth from '../middleware/auth.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'image-manager',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/upload', auth, upload.single('image'), uploadImage);
router.get('/', auth, getImages);
router.get('/search', auth, searchImages);

export default router;
