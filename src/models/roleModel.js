import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    uqique: true,
    default: 'USR',
  },
  active: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    default: '',
  },
  permissions: {
    type: String,
    default: "{}"
  },
}, { timestamps: true });

RoleSchema.statics.storeRole = async function ({ name, code, active, permissions, description }) {

  if (!name || !code) {
    throw new Error('Name and code are required');
  }

  const existingRole = await this.findOne({ code });
  if (existingRole) {
    throw new Error('This code already exists');
  }

  const role = await this.create({ name, code, active, permissions, description });
  return role;
}

RoleSchema.statics.updateRole = async function ({ description, name, permissions, active, id }) {
  const role = await this.findById(id);
  if (!role) {
    throw new Error('No roles found');
  }
  role.name = name;
  role.description = description;
  role.active = active;
  role.permissions = permissions;
  await role.save().then((updatedRole) => {
    return updatedRole;
  });
}
export default mongoose.model('roles', RoleSchema);