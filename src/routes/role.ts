import express from 'express';
import requireAuth from '../middleware/requireAuth';
import { createRole, deleteRole, getRoleList, updateRole } from '../controllers/roleConntroller';

const router = express.Router();
router.use(requireAuth);

router.get('/', getRoleList);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);
export default router;