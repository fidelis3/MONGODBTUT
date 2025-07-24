const express = require('express');
const { connectToDb, getDb } = require('./db');

// Initialize express app and middleware
const app = express();
app.use(express.json()); // Add this for parsing JSON requests

// Connect to db
let db;

connectToDb((err) => {
    if (!err) {
        console.log('Connected to database');
        db = getDb();
        
        // Define routes AFTER database connection
        app.get('/books', (req, res) => {
            let books = [];
            db.collection('books')
                .find()
                .sort({author: 1})
                .forEach(book => books.push(book))
                .then(() => {
                    res.status(200).json(books);
                })
                .catch(err => {
                    res.status(500).json({error: 'Could not fetch the books'});
                    console.error(err);
                });
        });

        // Add other routes here as needed
        // Example: POST route for adding books
        app.post('/books', (req, res) => {
            const book = req.body;
            db.collection('books')
                .insertOne(book)
                .then(result => {
                    res.status(201).json(result);
                })
                .catch(err => {
                    res.status(500).json({error: 'Could not create new book'});
                    console.error(err);
                });
        });



        // Start server AFTER everything is set up
        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
        
    } else {
        console.error('Database connection failed:', err);
    }
});