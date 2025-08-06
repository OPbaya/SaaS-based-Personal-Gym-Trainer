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
app.use(cors({
    origin: ['https://fitsutra.vercel.app', 'http://localhost:3000'], // Add all allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(clerkMiddleware())


// Add this middleware before your routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://fitsutra.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});
// app.use(requireAuth())

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Express Backendads!');
});
connectDB();

app.use("/api/data", requireAuth(), dataRoutes)

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
