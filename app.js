const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("./db");

// Initialize express app and middleware
const app = express();
app.use(express.json()); // Add this for parsing JSON requests

// Connect to db
let db;

connectToDb((err) => {
  if (!err) {
    console.log("Connected to database");
    db = getDb();

    // Define routes AFTER database connection
    app.get("/books", (req, res) => {
      let books = [];
      db.collection("books")
        .find()
        .sort({ author: 1 })
        .forEach((book) => books.push(book))
        .then(() => {
          res.status(200).json(books);
        })
        .catch((err) => {
          res.status(500).json({ error: "Could not fetch the books" });
          console.error(err);
        });
    });

    app.get("/books/:id", (req, res) => {
      // Check if the ID is VALID (not invalid)
      if (ObjectId.isValid(req.params.id)) {
        db.collection("books")
          .findOne({ _id: new ObjectId(req.params.id) })
          .then((doc) => {
            if (doc) {
              res.status(200).json(doc);
            } else {
              res.status(404).json({ error: "Book not found" });
            }
          })
          .catch((err) => {
            res.status(500).json({ error: "Could not fetch the book" });
            console.error(err);
          });
      } else {
        res.status(400).json({ error: "Invalid book ID" });
      }
    });
    app.post("/books", (req, res) => {
      const book = req.body;

      // Validate the book data
      if (!book.title || !book.author) {
        return res.status(400).json({ error: "Title and author are required" });
      }

      db.collection("books")
        .insertOne(book)
        .then((result) => {
          res.status(201).json(result);
        })
        .catch((err) => {
          res.status(500).json({ error: "Could not create the book" });
        });
    });
    app.delete("/books/:id", (req, res) => {
      // Check if the ID is VALID (not invalid)
      if (ObjectId.isValid(req.params.id)) {
        db.collection("books")
          .deleteOne({ _id: new ObjectId(req.params.id) })
          .then((result) => {
            res.status(200).json(result);
          })

          .catch((err) => {
            res.status(500).json({ error: "Could not delete the book" });
          });
      } else {
        res.status(400).json({ error: "Invalid book ID" });
      }
    });

    // Start server AFTER everything is set up
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } else {
    console.error("Database connection failed:", err);
  }
});
