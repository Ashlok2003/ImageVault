import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import { connectDB } from './config/database.js';

import authRoutes from './routes/auth.routes.js';
import imageRoutes from './routes/image.routes.js';
import folderRoutes from './routes/folder.routes.js';
import swaggerDocument from './config/swagger.js';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUI.serve,
  swaggerUI.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/folders', folderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

