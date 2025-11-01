import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
const MONGO_URI: string = process.env.MONGO_URI ?? 'mongodb://localhost:27017/msform';
export async function connectDB(): Promise<void> {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
}