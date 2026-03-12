import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Exercise from '../models/Exercise.js';
import WrongAnswer from '../models/WrongAnswer.js';
import db from '../config/database.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
    try {
        const exercises = await Exercise.getAll();
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/lesson/:lessonId', protect, async (req, res) => {
    try {
        const { lessonId } = req.params;
        const exercises = await Exercise.getByLesson(lessonId);
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/submit', protect, async (req, res) => {
    try {
        const { exerciseId, answer } = req.body;
        const userId = req.userId;

        const isCorrect = await Exercise.checkAnswer(exerciseId, answer);
        const exercise = await Exercise.getById(exerciseId);

        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        await db.execute(
            'INSERT INTO user_answers (user_id, exercise_id, user_answer, is_correct) VALUES (?, ?, ?, ?)',
            [userId, exerciseId, answer, isCorrect]
        );

        if (!isCorrect) {
            await WrongAnswer.add(userId, exerciseId, answer);
        } else {
            await WrongAnswer.remove(userId, exerciseId);
        }

        res.json({
            isCorrect,
            correctAnswer: exercise.correct_answer,
            message: isCorrect ? 'Correct answer!' : 'Wrong answer. Try again!'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/wrong-answers', protect, async (req, res) => {
    try {
        const userId = req.userId;
        const wrongAnswers = await WrongAnswer.getUserWrongAnswers(userId);
        res.json(wrongAnswers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;