import express from 'express';
import {
  register,
  login,
  deleteUser,
  getAllUsers,
  getAllUsersWithLists,
  getUserByEmail,
  getUserById,
  updateUser,
} from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.use(authMiddleware);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/users/id/:id', getUserById);
router.get('/users/email/:email', getUserByEmail);
router.get('/users/with-lists', getAllUsersWithLists);

export default router;
