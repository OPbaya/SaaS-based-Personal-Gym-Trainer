// server.js
import express from 'express';
import dotenv from 'dotenv';
import dataRoutes from './routes/dataRoutes.js';
import { connectDB } from './config/db.js';
import cors from 'cors';
import { clerkMiddleware, requireAuth } from '@clerk/express'

dotenv.config();
// import 'dotenv/config'

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())
app.use(requireAuth())

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Express Backendads!');
});
connectDB();

app.use("/api/data", dataRoutes)

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
