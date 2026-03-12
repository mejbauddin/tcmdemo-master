import db from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
    static async create(userData) {
        try {
            const { username, email, password } = userData;
            
            console.log('📝 Creating user in database:', { username, email });
            
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const [result] = await db.execute(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword]
            );
            
            console.log('✅ User inserted, ID:', result.insertId);
            return result.insertId;
        } catch (error) {
            console.error('❌ Error in User.create:');
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            return rows[0];
        } catch (error) {
            console.error('❌ Error in User.findByEmail:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.execute(
                'SELECT id, username, email, created_at FROM users WHERE id = ?', 
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('❌ Error in User.findById:', error);
            throw error;
        }
    }

    static async comparePassword(password, hashedPassword) {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            console.error('❌ Error in comparePassword:', error);
            throw error;
        }
    }
}

export default User;