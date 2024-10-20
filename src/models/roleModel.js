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
    default: false,
  },
}, { timestamps: true });

RoleSchema.statics.create = async function (name, code) {

  if (!name || !code) {
    throw new Error('Name and code are required');
  }

  const existingRole = await this.findOne({ code });
  if (existingRole) {
    throw new Error('This code already exists');
  }

  const role = await this.create({ name, code });
  return role;
}

RoleSchema.statics.update = async function (data) {

  if (!data.name || !data.code) {
    throw new Error('Name and code are required');
  }

  const existingRole = await this.findOne({ data.code });
  if (existingRole) {
    throw new Error('This code already exists');
  }

  const role = await this.({ name, code });
  return role;
}
export default mongoose.model('users', UserSchema);