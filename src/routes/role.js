import express from 'express';
import Role from '../models/roleModel.js';
import requireAuth from '../middleware/requireAuth.js';
import { createRole, deleteRole, getRoleList, updateRole } from '../controllers/roleConntroller.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', getRoleList);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);
export default router;