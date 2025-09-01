import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

export interface IUser extends Document {
  email: string;
  name: string;
  dob: Date;
  roleCode: string;
  password: string;
  active: boolean;
}

interface IUserModel extends Model<IUser> {
  logIn(email: string, password: string): Promise<IUser | null>;
  signUp(email: string, name: string, password: string): Promise<IUser | null>;
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

const User = mongoose.model<IUser, IUserModel>("User", UserSchema);
export default User;
