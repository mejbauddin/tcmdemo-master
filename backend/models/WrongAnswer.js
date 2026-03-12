import db from '../config/database.js';

class WrongAnswer {
    static async add(userId, exerciseId, wrongAnswer) {
        const [existing] = await db.execute(
            'SELECT * FROM wrong_answers WHERE user_id = ? AND exercise_id = ?',
            [userId, exerciseId]
        );

        if (existing.length > 0) {
            await db.execute(
                'UPDATE wrong_answers SET attempt_count = attempt_count + 1, last_attempt = CURRENT_TIMESTAMP WHERE user_id = ? AND exercise_id = ?',
                [userId, exerciseId]
            );
        } else {
            await db.execute(
                'INSERT INTO wrong_answers (user_id, exercise_id, wrong_answer) VALUES (?, ?, ?)',
                [userId, exerciseId, wrongAnswer]
            );
        }
    }

    static async getUserWrongAnswers(userId) {
        const [rows] = await db.execute(
            `SELECT wa.*, e.question_text, e.correct_answer, e.lesson_id 
             FROM wrong_answers wa
             JOIN exercises e ON wa.exercise_id = e.id
             WHERE wa.user_id = ?
             ORDER BY wa.last_attempt DESC`,
            [userId]
        );
        return rows;
    }

    static async remove(userId, exerciseId) {
        await db.execute(
            'DELETE FROM wrong_answers WHERE user_id = ? AND exercise_id = ?',
            [userId, exerciseId]
        );
    }
}

export default WrongAnswer;