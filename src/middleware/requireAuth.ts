import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { Request, Response } from 'express';

const requireAuth = async (req: Request, res: Response, next: Function) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).json({ status: 401, message: 'Unauthorized request' })
  }
  const token = authorization.split(' ')[1]
  try {
    const verify= jwt.verify(token, process.env.SECRET_KEY!)
    console.log("verify", verify)
    // req.user = await User.findOne({ id: verify.id }).select('id')
    next()
  } catch (error: any) {
    console.log(error)
    return res.status(401).json({ status: 401, message: 'Unauthorized request' })
  }
}

export default requireAuth;