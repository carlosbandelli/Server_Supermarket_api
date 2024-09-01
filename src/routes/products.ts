import express from 'express';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
} from '../controllers/ProductController';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.use(authMiddleware);

router.post('/', addProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/search', searchProduct);

export default router;
