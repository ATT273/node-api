import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import { HttpError } from "../utils/errors/custom-error";

export interface IUser extends Document {
  email: string;
  name: string;
  dob: Date;
  roleCode: string;
  password: string;
  active: boolean;
  isDeleted: boolean;
}

export interface IPayloadUser {
  email: string;
  name: string;
  dob: Date;
  roleCode: string;
  active?: boolean;
}

interface IUserModel extends Model<IUser> {
  logIn(email: string, password: string): Promise<IUser | null>;
  signUp(email: string, name: string, password: string): Promise<IUser | null>;
  createUser(data: IPayloadUser): Promise<{ status: number; code: string; message: string } | null>;
  updateUser(id: string, data: IPayloadUser): Promise<{ status: number; code: string; message: string } | null>;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roleCode: {
      type: String,
      default: "USR",
    },
    active: {
      type: Boolean,
      default: false,
    },
    dob: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.statics.signUp = async function (name, email, password) {
  if (!name || !email || !password) {
    throw new Error("Name, email and password are required");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }
  const existingUser = await this.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const salt = bcrypt.genSaltSync(10);
  const saltPassword = bcrypt.hashSync(password, salt);

  const user = await this.create({ name, email, password: saltPassword });
  return user;
};

UserSchema.statics.logIn = async function (email, password) {
  if (!email || !password) {
    throw new Error("email and password are required");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }
  const existingUser = await this.findOne({ email });
  if (!existingUser) {
    throw new Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, existingUser.password);
  if (!match) {
    throw new Error("Incorrect password");
  }
  return existingUser;
};

UserSchema.statics.createUser = async function (data) {
  if (!data.email || !data.name || !data.dob || !data.roleCode) {
    const error = new HttpError("All fields are required", 400, "missing_fields");
    throw error;
  }
  const existingUser = await this.findOne({ email: data.email });
  if (existingUser) {
    const error = new HttpError("User with this email already exists", 409, "email_conflict");
    throw error;
  }
  const defaultPassword = "123456";
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(defaultPassword, salt);
  await this.create({ ...data, password: hashedPassword });
  return { status: 201, code: "created_success", message: "User created successfully" };
};

UserSchema.statics.updateUser = async function (id: string, data: IPayloadUser) {
  if (!data.email || !data.name || !data.dob || !data.roleCode) {
    const error = new HttpError("All fields are required", 400, "missing_fields");
    throw error;
  }

  const user = await this.findOne({ _id: id });
  if (!user) {
    const error = new HttpError("User not found", 404, "user_not_found");
    throw error;
  }

  user.email = data.email;
  user.name = data.name;
  user.dob = data.dob;
  user.roleCode = data.roleCode;
  if (data.active !== undefined) {
    user.active = data.active;
  }
  await user.save();
  return { status: 200, code: "updated_success", message: "User updated successfully" };
};
const User = mongoose.model<IUser, IUserModel>("User", UserSchema);
export default User;
