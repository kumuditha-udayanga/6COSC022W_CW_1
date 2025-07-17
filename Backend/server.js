import cors from 'cors';
import dotenv from "dotenv";
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import countryRoutes from "./src/routes/countryRoutes.js";
import Database from './src/config/database.js';

dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

Database.initializeDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/countries', countryRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
