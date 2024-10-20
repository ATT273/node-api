import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).json({ status: 401, message: 'Unauthorized request' })
  }
  const token = authorization.split(' ')[1]
  try {
    const { id } = jwt.verify(token, process.env.SECRET_KEY)
    req.user = await User.findOne({ id }).select('id')
    next()
  } catch (error) {
    console.log(error)
    return res.status(401).json({ status: 401, message: 'Unauthorized request' })
  }
}

export default requireAuth;