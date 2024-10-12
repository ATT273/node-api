import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();

router.get('/', async function (req, res) {
  try {
    const users = await User.find()
    console.log('user', users)
    if (!users) {
      res.status(404).json({ message: 'No users found' })
      return
    }
    res.json({ users })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
});

router.get('/:id', async function (req, res) { });
router.put('/:id', async function (req, res) { });

export default router;