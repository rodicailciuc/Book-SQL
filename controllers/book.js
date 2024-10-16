import query from '../config/db.js';

const bookControllers = {
    getAllBooks: async (req, res) => {
        const sqlStr = 'SELECT * FROM books';
        const token = req.cookies.token;
        try {
            const result = await query(sqlStr, []);
            console.log(result);

            if (result.length > 0) {
                res.status(200).render('books', { books: result, token });
            } else {
                res.status(404).render('404', {
                    title: 'Error',
                    message: 'No books found'
                });
            }
        } catch (err) {
            res.status(500).render('404', {
                title: 'Server Error',
                message: 'An error occurred while fetching books'
            });
        }
    },
    getBook: async (req, res) => {
        const { id } = req.params;
        const sqlStr = 'SELECT * FROM books WHERE id = ?';
        const params = [id];

        try {
            const result = await query(sqlStr, params);

            if (result.length > 0) {
                res.status(200).render('book', {
                    book: result[0],
                    token: req.cookies.token
                });
            } else {
                res.status(404).render('404', {
                    title: 'Error',
                    message: 'No books found'
                });
            }
        } catch (err) {
            res.status(500).render('404', {
                title: 'Server Error',
                message: 'An error occurred while fetching the book'
            });
        }
    },
    createBookForm: (req, res) => {
        res.status(200).render('add-book-form');
    },
    createBook: async (req, res) => {
        const { title, author, price, image } = req.body;

        if (title && author && price && image) {
            const sqlStr =
                'INSERT INTO books (title, author, price, image) VALUES (?, ?, ?, ?)';
            const params = [title, author, price, image];
            try {
                const result = await query(sqlStr, params);
                if (result.affectedRows > 0) {
                    res.status(302).redirect('/api/books');
                } else {
                    res.status(404).json({
                        message: 'Failed to create a book'
                    });
                }
            } catch (err) {
                res.status(500).json({ message: 'Error creating book', error });
            }
        } else {
            res.status(400).render('404', {
                title: 'Error',
                message: 'All fields are required'
            });
        }
    },
    updateBookForm: async (req, res) => {
        const { id } = req.params;
        const sqlStr = 'SELECT * FROM books WHERE id = ?';
        const params = [id];

        try {
            const result = await query(sqlStr, params);

            if (result.length > 0) {
                const book = result[0];
                res.status(200).render('update-book-form', { book });
            } else {
                res.status(404).render('404', {
                    title: 'Book not found',
                    message: "The book you're looking for doesn't exist"
                });
            }
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving book details',
                error
            });
        }
    },
    updateBook: async (req, res) => {
        const { id } = req.params;
        const { title, author, price, image } = req.body;

        if (!title || !author || !price || !image) {
            return res.status(400).render('404', {
                title: 'Error',
                message: 'All fields are required'
            });
        }

        const sqlStr =
            'UPDATE books SET title = ?, author = ?, price = ?, image = ? WHERE id = ?';
        const params = [title, author, price, image, id];

        try {
            const result = await query(sqlStr, params);

            if (result.affectedRows > 0) {
                res.status(302).redirect(`/api/books/`);
            } else {
                res.status(404).render('404', {
                    title: 'Error',
                    message: 'Failed to update the book'
                });
            }
        } catch (err) {
            res.status(500).json({ message: 'Error updating book', err });
        }
    },
    deleteBook: async (req, res) => {
        const { id } = req.params;
        const sqlStr = 'DELETE FROM books WHERE id = ?';
        const params = [id];
        try {
            const result = await query(sqlStr, params);

            if (result.affectedRows > 0) {
                res.status(302).redirect('/api/books');
            } else {
                res.status(404).render('404', {
                    title: 'Error',
                    message: 'Failed to delete the book'
                });
            }
        } catch (err) {
            res.status(500).json({ message: 'Error deleting book', err });
        }
    }
};

export default bookControllers;
