import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const DBConfig = mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(
      `MongoDB Connected successfully to ${mongoose.connection.host}`
    );
  })
  .catch((error) => {
    console.log(`MongoDB failed to connect ${mongoose.connection.host}`);
  });

export default DBConfig;
