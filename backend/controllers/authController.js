import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

export const register = async (req, res) => {
    try {
        console.log('📝 Registration attempt with:', req.body);
        
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide username, email and password' 
            });
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists with this email' 
            });
        }

        const userId = await User.create({ username, email, password });
        const token = generateToken(userId);

        res.status(201).json({
            success: true,
            id: userId,
            username,
            email,
            token
        });
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: error.message 
        });
    }
};

export const login = async (req, res) => {
    try {
        console.log('🔐 Login attempt with:', req.body.email);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide email and password' 
            });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        const token = generateToken(user.id);

        res.json({
            success: true,
            id: user.id,
            username: user.username,
            email: user.email,
            token
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        res.json({
            success: true,
            ...user
        });
    } catch (error) {
        console.error('❌ Profile error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};