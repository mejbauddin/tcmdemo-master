import db from '../config/database.js';

class Exercise {
    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM exercises ORDER BY lesson_id, id');
        return rows;
    }

    static async getByLesson(lessonId) {
        const [rows] = await db.execute('SELECT * FROM exercises WHERE lesson_id = ?', [lessonId]);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute('SELECT * FROM exercises WHERE id = ?', [id]);
        return rows[0];
    }

    static async checkAnswer(exerciseId, userAnswer) {
        const [rows] = await db.execute('SELECT correct_answer FROM exercises WHERE id = ?', [exerciseId]);
        if (rows.length === 0) return null;
        return rows[0].correct_answer.toLowerCase() === userAnswer.toLowerCase();
    }
}

export default Exercise;