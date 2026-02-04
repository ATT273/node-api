import User, { IUser } from "../models/userModel";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import Role, { IRole } from "../models/roleModel";

const createJWT = async (user: IUser) => {
  return jwt.sign({ id: user._id, role: user.roleCode }, process.env.SECRET_KEY!, { expiresIn: "24h" });
};
const signUp = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    const user = await User.signUp(name, email, password);

    if (!user) throw new Error("User registration failed");

    const accessToken = await createJWT(user);
    res.status(200).json({ status: 200, email, name: user.name, id: user._id, accessToken });
  } catch (error: any) {
    res.status(400).json({ status: 400, message: error.message });
  }
};

const logIn = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.logIn(email, password);
    if (!user) throw new Error("Invalid email or password");
    const role = user.roleCode ? await Role.findRoleByCode(user.roleCode) : ({} as IRole);
    const accessToken = await createJWT(user);
    const data = {
      email,
      name: user.name,
      id: user._id,
      permissions: role.permissions,
      roleCode: user.roleCode,
      roleActive: role?.active,
      accessToken,
    };
    res.status(200).json({ data, status: 200 });
  } catch (error: any) {
    res.status(400).json({ status: 400, message: error.message });
  }
};

export { signUp, logIn };
