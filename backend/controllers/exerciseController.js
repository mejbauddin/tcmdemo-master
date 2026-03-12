const Exercise = require('../models/Exercise');
const WrongAnswer = require('../models/WrongAnswer');
const db = require('../config/database');

const getAllExercises = async (req, res) => {
    try {
        const exercises = await Exercise.getAll();
        res.json(exercises);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getExercisesByLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const exercises = await Exercise.getByLesson(lessonId);
        res.json(exercises);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const submitAnswer = async (req, res) => {
    try {
        const { exerciseId, answer } = req.body;
        const userId = req.userId;

        // Check if answer is correct
        const isCorrect = await Exercise.checkAnswer(exerciseId, answer);
        const exercise = await Exercise.getById(exerciseId);

        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        // Save user answer
        await db.execute(
            'INSERT INTO user_answers (user_id, exercise_id, user_answer, is_correct) VALUES (?, ?, ?, ?)',
            [userId, exerciseId, answer, isCorrect]
        );

        // If wrong, add to wrong answers
        if (!isCorrect) {
            await WrongAnswer.add(userId, exerciseId, answer);
        } else {
            // If correct, remove from wrong answers if exists
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
};

const getWrongAnswers = async (req, res) => {
    try {
        const userId = req.userId;
        const wrongAnswers = await WrongAnswer.getUserWrongAnswers(userId);
        res.json(wrongAnswers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllExercises,
    getExercisesByLesson,
    submitAnswer,
    getWrongAnswers
};