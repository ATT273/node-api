import User from '../models/userModel';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

interface UserDocument {
  _id: string;
  email: string;
  name: string;
  dob: string;
  roleCode: string;
  password?: string;
  save: () => Promise<UserDocument>;
}

interface GetUserDetailsRequest extends Request {
  params: {
    id: string;
  };
}

interface GetUserDetailsResponse extends Response {}

export const getUserList = async (req: Request, res: Response): Promise<void> => {
  const { authorization } = req.headers
  // const claim = jwt.decode(authorization.split(' ')[1]);
  try {
    const users = await User.find();
    if (!users) {
      res.status(404).json({ status: 404, message: 'No users found' })
      return
    }
    res.status(200).json({ status: 200, data: [...users] });
  } catch (error: any) {
    res.status(400).json({ status: 404, message: error.message });
  }
}



export const getUserDetails = async (
  req: GetUserDetailsRequest,
  res: GetUserDetailsResponse
): Promise<void> => {
  const { id } = req.params;
  try {
    const user: UserDocument | null = await User.findById(id);
    if (!user) {
      res.status(404).json({ status: 404, message: 'No users found' });
      return;
    }
    res.status(200).json({
      status: 200,
      data: {
        email: user.email,
        name: user.name,
        dob: user.dob,
        id: user._id,
        role: user.roleCode,
      },
    });
  } catch (error: any) {
    res.status(400).json({ status: 404, message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error: any) {
    res.status(400).json({ status: 404, message: error.message });
  }
}

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error: any) {
    res.status(400).json({ status: 404, message: error.message });
  }
}

export const assignRole = async (req: Request, res: Response): Promise<void> => {
  const { role } = req.body;
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).json({ status: 404, message: 'No users found' })
      return
    }
    user.roleCode = role;
    await user.save().then((updatedUser) => {
      res.status(200).json({ status: 200, data: updatedUser });
    });
  } catch (error: any) {
    res.status(500).json({ status: 500, message: error.message });
  }
}