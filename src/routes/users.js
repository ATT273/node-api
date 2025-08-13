import express from 'express';
import User from '../models/userModel.js';
import requireAuth from '../middleware/requireAuth.js';
import { getUserList, getUserDetails, updatProfile, updatePassword, assignRole } from '../controllers/userController.js';

const router = express.Router();
router.use(requireAuth);

router.get('/:id', getUserDetails);
router.patch('/:id', updatProfile);
router.patch('/password/:id', updatePassword);
router.get('/', getUserList);
router.get('/:id/assign', assignRole);

export default router;