import query from '../config/db.js';

const userTable = async () => {
    const sqlStr = `CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );`;
    try {
        await query(sqlStr);
        console.log('Users table created');
    } catch (err) {
        console.error('Error creating users table:', err);
        throw err;
    }
};

export default userTable;
