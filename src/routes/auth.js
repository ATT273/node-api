import express from 'express';
import { signUp, logIn, logOut } from '../controllers/authController.js';
const router = express.Router();

router.post('/login', logIn);
router.get('/logout', logOut);
router.post('/register', signUp);
export default router;