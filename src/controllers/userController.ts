import User from "../models/userModel";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { HttpError } from "../utils/errors/custom-error";

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
  user: { id: string; role?: string }; // extend request type
}

interface GetUserDetailsResponse extends Response {}

export const getUserList = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({
      isDeleted: false,
    });
    if (!users) {
      res.status(404).json({ status: 404, message: "No users found" });
      return;
    }
    const response = users.map((user) => {
      return {
        email: user.email,
        name: user.name,
        dob: user.dob,
        id: user._id,
        roleCode: user.roleCode,
        active: user.active,
      };
    });
    res.status(200).json({ status: 200, data: [...response] });
  } catch (error: any) {
    res.status(400).json({ status: 404, message: error.message });
  }
};

export const getUserDetails = async (req: GetUserDetailsRequest, res: GetUserDetailsResponse): Promise<void> => {
  const { id } = req.params;

  try {
    const user: UserDocument | null = await User.findById(id);
    if (!user) {
      res.status(404).json({ status: 404, message: "No users found" });
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

export const updateProfile = async (req: GetUserDetailsRequest, res: Response): Promise<void> => {
  const { email, name, dob } = req.body;
  const { id } = req.params;
  const userData = req.user;
  if (userData.id !== id && userData.role !== "admin") {
    res.status(403).json({ status: 403, message: "Forbidden: You don't have permission to update this profile" });
    return;
  }
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).json({ status: 404, message: "No users found" });
      return;
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
};

export const updatePassword = async (req: GetUserDetailsRequest, res: Response): Promise<void> => {
  const { newPassword } = req.body;
  const { id } = req.params;
  const userData = req.user;
  if (userData.id !== id && userData.role !== "admin") {
    res.status(403).json({ status: 403, message: "Forbidden: You don't have permission to update this profile" });
    return;
  }
  if (!newPassword) {
    res.status(400).json({ status: 400, message: "Password is required" });
    return;
  }

  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).json({ status: 404, message: "No users found" });
      return;
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
};

export const assignRole = async (req: Request, res: Response): Promise<void> => {
  const { role } = req.body;
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.status(404).json({ status: 404, message: "No users found" });
      return;
    }
    user.roleCode = role;
    await user.save().then((updatedUser) => {
      res.status(200).json({ status: 200, data: updatedUser });
    });
  } catch (error: any) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const deleteUser = async (req: GetUserDetailsRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userData = req.user;
  if (userData.id !== id && userData.role !== "ADM") {
    res.status(403).json({ status: 403, message: "Forbidden: You don't have permission to delete this user" });
    return;
  }
  try {
    const _existedUser = await User.findById({ _id: id });
    if (!_existedUser) {
      res.status(404).json({ status: 404, message: "No user found" });
      return;
    }
    _existedUser.isDeleted = true;
    await _existedUser.save().then(() => {
      res.status(200).json({ status: 200, message: "User deleted successfully" });
    });
  } catch (error: any) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const data = req.body;
  try {
    const user = await User.createUser(data);
    res.status(201).json({ data: user });
  } catch (error: any) {
    const status = error.status || 500;
    const code = error.code || "internal_server_error";
    res.status(status).json({
      data: { status, message: error.message, code },
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const data = req.body;
  const { id } = req.params;
  try {
    const user = await User.updateUser(id, data);
    res.status(200).json({ data: user });
  } catch (error: any) {
    res.status(500).json({ data: { status: 500, message: error.message, code: "internal_server_error" } });
  }
};
