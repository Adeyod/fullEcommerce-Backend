import mongoose from 'mongoose';
// import { ObjectId } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'seller', 'admin'] },
    resetToken: { type: String },
    provider: { type: String, default: '' },
    providerId: { type: Number },
    verified: { type: Boolean, default: 'false' },
    status: { type: String, default: 'active' },
    profilePicture: {
      type: String,
      default:
        'https://res.cloudinary.com/dgxyjw6q8/image/upload/v1696332701/default_mwrcrs.png',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
