import mongoose, { Schema } from 'mongoose';
// import ObjectId = require("mongoose").Types.ObjectId
// import ObjectId from mongoose.Types.ObjectId
// import { ObjectId } from 'mongoose';

const tokenSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'user',
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now(), expires: 1800 },
});

const Token = mongoose.model('Token', tokenSchema);
export default Token;
