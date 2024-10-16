import query from '../config/db.js';

const bookTable = async () => {
    const sqlStr = `CREATE TABLE IF NOT EXISTS books(
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR (255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);`;

    try {
        await query(sqlStr);
        console.log('Books table created');
    } catch (err) {
        console.error('Error creating books table:', err);
        throw err;
    }
};

export default bookTable;
