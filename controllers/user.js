import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import validateEmail from '../utils/validateEmail.js';
import validatePassword from '../utils/validatePassword.js';
import hashPassword from '../utils/hashPassword.js';
import matchPassword from '../utils/matchPasswords.js';

import query from '../config/db.js';

const userControllers = {
    getRegisterForm: (req, res) => {
        res.status(200).render('register-form');
    },
    getRegister: async (req, res) => {
        const { email, password, rePassword } = req.body;
        // const { email, password, rePassword } = {
        //     email: 'test@example.com',
        //     password: 'Test123!',
        //     rePassword: 'Test123!'
        // };

        console.log('Inputs:', { email, password, rePassword });

        try {
            const checkEmailQuery = `SELECT * FROM users WHERE email=?`;
            const checkEmailParams = [email];
            const result = await query(checkEmailQuery, checkEmailParams);

            if (result.length > 0) {
                return res.status(400).render('404', {
                    title: 'Email already exists',
                    message: 'Email already exists, please login'
                });
            }

            const isEmailValid = validateEmail(email);
            const isPasswordValid = validatePassword(password);
            const doPasswordsMatch = matchPassword(password, rePassword);

            if (isEmailValid && isPasswordValid && doPasswordsMatch) {
                const hashedPassword = hashPassword(password);

                const sqlQuery = `INSERT INTO users (email, password) VALUES (?, ?)`;
                const params = [email, hashedPassword];
                const results = await query(sqlQuery, params);

                if (results.affectedRows > 0) {
                    res.status(302).redirect('/api/login');
                    console.log('User registered:', { email });
                } else {
                    res.status(400).render('404', {
                        title: 'Registration failed',
                        message: 'Failed to register user'
                    });
                }
            } else {
                res.status(400).render('404', {
                    title: 'Invalid input',
                    message: 'Please check your inputs'
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).render('404', {
                title: 'Server error',
                message: 'An error occurred. Please try again later.'
            });
        }
    },
    getLoginForm: (req, res) => {
        res.status(200).render('login-form');
    },
    getLogin: async (req, res) => {
        const { email, password } = req.body;
        console.log('Login Inputs:', { email, password });

        const sqlStr = 'SELECT * FROM users WHERE email = ?';
        const params = [email];
        const result = await query(sqlStr, params);
        console.log(result);

        if (result.length === 0) {
            return res.status(400).render('404', {
                title: 'Email does not exist',
                message: 'Email does not exist, please register'
            });
        }
        //check if the password is correct
        bcrypt.compare(password, result[0].password, (err, isValid) => {
            if (err) {
                return console.error(err);
            }

            if (!isValid) {
                return res.status(400).render('404', {
                    title: 'Invalid password or email',
                    message: 'Invalid password or email'
                });
            }
            const token = jwt.sign({ email }, process.env.TOKEN_SECRET);

            // set cookie
            if (token) {
                res.cookie('token', token, {
                    httpOnly: true
                });
                res.status(302).redirect('/api/books');
            }
        });
    },

    getLogout: (req, res) => {
        res.clearCookie('token');
        res.status(302).redirect('/api/books');
    },
    getAllUsers: async (req, res) => {
        const sqlStr = 'SELECT * FROM users';
        const result = await query(sqlStr, []);
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'No users found' });
        }
    },
    getUser: async (req, res) => {
        const { id } = req.params;
        const sqlStr = 'SELECT * FROM users WHERE id = ?';
        const params = [id];
        const result = await query(sqlStr, params);

        if (result.length > 0) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    },
    editUser: async (req, res) => {
        const { id } = req.params;
        const { email, password } = req.body;

        try {
            const hashedPassword = password
                ? hashPassword(password)
                : undefined;

            const sqlStr = `UPDATE users SET 
                            email = COALESCE(?, email), 
                            password = COALESCE(?, password) 
                            WHERE id = ?`;
            const params = [email, hashedPassword, id];

            const result = await query(sqlStr, params);

            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'User updated successfully' });
            } else {
                res.status(404).json({
                    message: 'User not found or no changes made'
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    },
    deleteUser: async (req, res) => {
        const { id } = req.params;
        const sqlStr = 'DELETE FROM users WHERE id = ?';
        const params = [id];

        try {
            const result = await query(sqlStr, params);
            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'User deleted successfully' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

export default userControllers;
