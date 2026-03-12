import db from '../config/database.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for audio upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname) || '.webm';
        cb(null, 'voice-' + uniqueSuffix + ext);
    }
});

export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /audio\/(mp3|wav|mpeg|ogg|webm|mp4)/;
        if (allowedTypes.test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only audio files are allowed.'));
        }
    }
});

// Simulated voice assessment with more realistic feedback
const assessPronunciation = (audioPath, expectedText) => {
    // In production, integrate with actual speech recognition API
    // For demo, we'll return simulated results based on the audio filename
    
    const random = Math.random();
    const textLength = expectedText.length;
    
    let accuracy, transcript, feedback;
    
    if (random > 0.8) {
        accuracy = 95 + (Math.random() * 5);
        transcript = expectedText;
        feedback = 'Excellent! Perfect pronunciation and tone.';
    } else if (random > 0.5) {
        accuracy = 75 + (Math.random() * 15);
        // Simulate missing some characters
        const charsToKeep = Math.floor(textLength * 0.8);
        transcript = expectedText.substring(0, charsToKeep) + '...';
        feedback = 'Good attempt! Pay attention to the complete phrase.';
    } else if (random > 0.2) {
        accuracy = 50 + (Math.random() * 20);
        // Simulate wrong pronunciation
        transcript = expectedText.replace(/[的了吗]/g, '').replace(/[头气]/g, 'tou');
        feedback = 'Keep practicing. Focus on tone and clarity.';
    } else {
        accuracy = 30 + (Math.random() * 15);
        transcript = '... (unclear)';
        feedback = 'Try speaking more clearly and at a moderate pace.';
    }
    
    return {
        transcript,
        accuracy: Math.round(accuracy * 100) / 100,
        feedback,
        expected: expectedText
    };
};

export const submitVoiceAssessment = async (req, res) => {
    try {
        const { exerciseId, expectedText } = req.body;
        const userId = req.userId;
        const audioFile = req.file;

        console.log('📝 Voice assessment received:', {
            userId,
            exerciseId,
            expectedText,
            file: audioFile?.filename
        });

        if (!audioFile) {
            return res.status(400).json({ 
                success: false,
                message: 'No audio file uploaded' 
            });
        }

        // Get expected text from exercise if not provided
        let expected = expectedText;
        if (!expected) {
            const [exercise] = await db.execute(
                'SELECT correct_answer FROM exercises WHERE id = ?', 
                [exerciseId]
            );
            if (exercise.length > 0) {
                expected = exercise[0].correct_answer;
            } else {
                return res.status(404).json({ 
                    success: false,
                    message: 'Exercise not found' 
                });
            }
        }

        // Assess pronunciation
        const assessment = assessPronunciation(audioFile.path, expected);

        // Save assessment to database
        const [result] = await db.execute(
            `INSERT INTO voice_assessments 
             (user_id, exercise_id, audio_url, transcript, accuracy_score, feedback) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                userId, 
                exerciseId, 
                `/uploads/${audioFile.filename}`, 
                assessment.transcript,
                assessment.accuracy,
                assessment.feedback
            ]
        );

        console.log('✅ Voice assessment saved:', result.insertId);

        res.json({
            success: true,
            assessmentId: result.insertId,
            ...assessment
        });

    } catch (error) {
        console.error('❌ Voice assessment error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during voice assessment',
            error: error.message 
        });
    }
};

export const getVoiceAssessments = async (req, res) => {
    try {
        const userId = req.userId;
        const [rows] = await db.execute(
            `SELECT va.*, e.question_text, e.correct_answer 
             FROM voice_assessments va
             JOIN exercises e ON va.exercise_id = e.id
             WHERE va.user_id = ?
             ORDER BY va.created_at DESC`,
            [userId]
        );
        
        res.json({
            success: true,
            assessments: rows
        });
    } catch (error) {
        console.error('❌ Error fetching voice assessments:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};