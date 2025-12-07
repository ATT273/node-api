import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: { id: string; role?: string }; // extend request type
}

const requireAuth = async (req: AuthRequest, res: Response, next: Function) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ status: 401, message: "Unauthorized request" });
  }
  const token = authorization.split(" ")[1];
  try {
    const verify = jwt.verify(token, process.env.SECRET_KEY!) as { id: string; role: string };
    req.user = verify;
    next();
  } catch (error: any) {
    console.log("error", error);
    return res.status(401).json({ status: 401, message: "Unauthorized request" });
  }
};

export default requireAuth;
