import express from 'express';
import { signUp, logIn } from '../controllers/authController';
const router = express.Router();

router.post('/login', logIn);
router.post('/register', signUp);
export default router;