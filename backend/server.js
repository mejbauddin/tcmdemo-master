import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import voiceRoutes from './routes/voiceRoutes.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/voice', voiceRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: 'TCM Learning API is running',
        endpoints: {
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            profile: 'GET /api/auth/profile',
            exercises: 'GET /api/exercises',
            submitAnswer: 'POST /api/exercises/submit',
            wrongAnswers: 'GET /api/exercises/wrong-answers',
            voiceAssess: 'POST /api/voice/assess'
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found',
        requestedPath: req.originalUrl
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📝 Test at: http://localhost:${PORT}`);
    console.log(`🔑 Register endpoint: http://localhost:${PORT}/api/auth/register`);
});