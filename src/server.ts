import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth';
import listRoutes from './routes/lists';
import productRoutes from './routes/products';

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());
server.use('/auth', authRoutes);
server.use('/lists', listRoutes);
server.use('/products', productRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
