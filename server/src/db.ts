import mongoose from 'mongoose';

export const connectToDatabase = async () => {
  const uri = Bun.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is required to start the server');
  }

  await mongoose.connect(uri);
};
