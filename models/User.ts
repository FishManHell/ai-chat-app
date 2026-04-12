import mongoose, { Schema } from "mongoose"
import type { IUser } from "@/entities/user/types"

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
)

const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema)

export default UserModel
