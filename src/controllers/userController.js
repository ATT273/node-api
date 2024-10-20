import mongoose from 'mongoose';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const getUserList = async (req, res) => {
  const { authorization } = req.headers
  const claim = jwt.decode(authorization.split(' ')[1]);
  try {
    const users = await User.find();
    if (!users) {
      res.status(404).json({ status: 404, message: 'No users found' })
      return
    }
    res.status(200).json({ status: 200, data: [...users] });
  } catch (error) {
    res.status(400).json({ status: 404, message: error.message });
  }
}

export const getUserDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ status: 404, message: 'No users found' })
      return
    }
    res.status(200).json({ status: 200, data: { email: user.email, name: user.name, dob: user.dob, id: user._id, role: user.role_cd } });
  } catch (error) {
    res.status(400).json({ status: 404, message: error.message });
  }
}

export const updateUser = async (req, res) => {
  const { email, name, dob } = req.body;
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).json({ status: 404, message: 'No users found' })
      return
    }
    user.email = email;
    user.name = name;
    user.dob = dob;

    await user.save().then((updatedUser) => {
      res.status(200).json({ status: 200, data: updatedUser });
    });
  } catch (error) {
    res.status(400).json({ status: 404, message: error.message });
  }
}

export const updatePassword = async (req, res) => {
  const { newPassword } = req.body;
  const { id } = req.params;
  if (!newPassword) {
    res.status(400).json({ status: 400, message: 'Password is required' });
    return
  }
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).json({ status: 404, message: 'No users found' })
      return
    }
    const salt = bcrypt.genSaltSync(10);
    const saltPassword = bcrypt.hashSync(newPassword, salt);
    user.password = saltPassword;
    await user.save().then((updatedUser) => {
      res.status(200).json({ status: 200, data: updatedUser });
    });
  } catch (error) {
    res.status(400).json({ status: 404, message: error.message });
  }
}