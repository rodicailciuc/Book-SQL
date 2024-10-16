import express from 'express';

import userControllers from '../controllers/user.js';

const router = express.Router();

const {
    getRegisterForm,
    getRegister,
    getLoginForm,
    getLogin,
    getLogout,
    getAllUsers,
    getUser,
    editUser,
    deleteUser
} = userControllers;

// routes
router.get('/register', getRegisterForm);
router.post('/register', getRegister);
router.get('/login', getLoginForm);
router.post('/login', getLogin);
router.get('/logout', getLogout);
router.get('/all', getAllUsers);
router.get('/all/:id', getUser);
router.put('/edit/:id', editUser);
router.delete('/delete/:id', deleteUser);

export default router;
