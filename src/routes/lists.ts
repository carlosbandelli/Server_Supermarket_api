import express from 'express';
import {
  createList,
  getLists,
  updateList,
  deleteList,
  getListById,
} from '../controllers/ListController';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createList);
router.get('/list/:id', getListById);
router.get('/', getLists);
router.put('/:id', updateList);
router.delete('/:id', deleteList);

export default router;
