import express from 'express';
import {
  deleteUserData,
  getUserData,
  updateUserData,
} from '../controllers/userController';

const router = express.Router();

router.get('/', getUserData);
router.delete('/', deleteUserData);
router.patch('/', updateUserData);

export default router;
