import express from 'express';

import bookControllers from '../controllers/book.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

const {
    getAllBooks,
    getBook,
    createBookForm,
    createBook,
    updateBookForm,
    updateBook,
    deleteBook
} = bookControllers;
// routes
router.get('/books', getAllBooks);
router.get('/book/:id', getBook);
router.get('/add-book', verifyToken, createBookForm);
router.post('/add-book', verifyToken, createBook);
router.get('/update-book/:id', verifyToken, updateBookForm);
router.put('/update-book/:id', verifyToken, updateBook);
router.delete('/delete-book/:id', verifyToken, deleteBook);

export default router;
