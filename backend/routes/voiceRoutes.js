import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js';
import db from '../config/database.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'voice-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /audio\/(mp3|wav|mpeg|ogg|webm)/;
        if (allowedTypes.test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only audio files are allowed.'));
        }
    }
});

const router = express.Router();

router.post('/assess', protect, upload.single('audio'), async (req, res) => {
    try {
        const { exerciseId, expectedText } = req.body;
        const userId = req.userId;
        const audioFile = req.file;

        if (!audioFile) {
            return res.status(400).json({ message: 'No audio file uploaded' });
        }

        // Simulated assessment
        const random = Math.random();
        let accuracy, transcript, feedback;

        if (random > 0.7) {
            accuracy = 95 + Math.random() * 5;
            transcript = expectedText;
            feedback = 'Excellent pronunciation! Very clear and accurate.';
        } else if (random > 0.3) {
            accuracy = 70 + Math.random() * 20;
            transcript = expectedText.replace(/[的了吗]/g, '');
            feedback = 'Good attempt! Pay attention to tone and complete phrases.';
        } else {
            accuracy = 40 + Math.random() * 20;
            transcript = '部分正确 (partially correct)';
            feedback = 'Keep practicing. Focus on the correct pronunciation of each word.';
        }

        const [result] = await db.execute(
            `INSERT INTO voice_assessments 
             (user_id, exercise_id, audio_url, transcript, accuracy_score, feedback) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                userId, 
                exerciseId, 
                `/uploads/${audioFile.filename}`, 
                transcript,
                Math.round(accuracy * 100) / 100,
                feedback
            ]
        );

        res.json({
            success: true,
            assessmentId: result.insertId,
            transcript,
            accuracy: Math.round(accuracy * 100) / 100,
            feedback,
            expected: expectedText
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/assessments', protect, async (req, res) => {
    try {
        const userId = req.userId;
        const [rows] = await db.execute(
            `SELECT va.*, e.question_text 
             FROM voice_assessments va
             JOIN exercises e ON va.exercise_id = e.id
             WHERE va.user_id = ?
             ORDER BY va.created_at DESC`,
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;