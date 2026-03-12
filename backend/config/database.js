import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔌 Connecting to database...');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tcm_learning',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

const promisePool = pool.promise();

// Test connection
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ Database connected successfully!');
        connection.release();
    } catch (err) {
        console.error('❌ Database connection failed:');
        console.error('Error:', err.message);
        console.error('Code:', err.code);
    }
};

testConnection();

export default promisePool;