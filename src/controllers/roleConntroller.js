import mongoose from 'mongoose';
import Role from '../models/roleModel.js';

export const getRoleList = async (req, res) => {
  try {
    const roles = await Role.find();

    if (!roles) {
      res.status(404).json({ status: 404, message: 'No roles found' })
      return
    }
    res.status(200).json({ status: 200, data: roles });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
}

export const createRole = async (req, res) => {
  const { name, code, active, permissions, description } = req.body;
  try {
    const role = await Role.storeRole({ name, code, active, permissions, description });
    res.status(200).json({ status: 200, message: 'success', data: role });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
}

export const updateRole = async (req, res) => {
  const { name, description, active, permissions } = req.body;
  const { id } = req.params;
  try {
    const role = await Role.updateRole({ id, name, description, active, permissions });
    res.status(200).json({ status: 200, message: 'success', data: role });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
}

export const deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    const _existedRole = await Role.findById({ _id: id });
    if (!_existedProduct) {
      res.status(404).json({ status: 404, message: 'No products found' })
      return
    }
    const role = await Role.deleteOne({ _id: id });
    res.status(200).json({ status: 200, message: 'Role has been deleted' });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).json({ status: 404, message: 'Invalid id. No roles found' })
      return
    }
    res.status(500).json({ status: 500, message: error.message });
  }
}