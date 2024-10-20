import express from 'express';
import User from '../models/userModel.js';
import requireAuth from '../middleware/requireAuth.js';
import { getUserList, getUserDetails, updateUser, updatePassword } from '../controllers/userController.js';

const router = express.Router();
router.use(requireAuth);

router.get('/:id', getUserDetails);
router.patch('/:id', updateUser);
router.patch('/password/:id', updatePassword);
router.get('/', getUserList);

export default router;