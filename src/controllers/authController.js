import mongoose from 'mongoose';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const createJWT = async (user) => {
  return jwt.sign({ id: user._id, role: user.role_cd }, process.env.SECRET_KEY, { expiresIn: '24h' })
}
const signUp = async (req, res) => {

  const { name, email, password } = req.body;
  try {
    const user = await User.signUp(name, email, password);
    const accessToken = await createJWT(user)
    res.status(200).json({ status: 200, email, name: user.name, id: user._id, accessToken });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.logIn(email, password);
    const accessToken = await createJWT(user)
    return res.status(200).json({ email, name: user.name, id: user._id, accessToken, status: 200 });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
}


export { signUp, logIn }