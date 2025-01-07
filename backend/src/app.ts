import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
import path from 'path';


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // Allow only the frontend's origin
}));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
