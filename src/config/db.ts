import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: 10,
    multipleStatements: true
});

// Helper function to query the database
export const queryDatabase = (query: string, params: any[]) => {
    return new Promise<any>((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                console.error('MySQL connection error:', err);
                reject(err);
            } else {
                conn.query(query, params, (err, rows) => {
                    conn.release();
                    if (err) {
                        console.error('Error executing query:', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            }
        });
    });
};
