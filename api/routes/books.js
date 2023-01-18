const express = require("express");
const router = express.Router();
var ObjectId = require("mongodb").ObjectID;
const Book = require("../models/books");

//** List all books
router.get("/", (req, res) => {
  Book.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json({
        count: docs.length,
        books: docs,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//** List a book by id or name
router.get("/book", (req, res) => {
  let query;
  if (req.query.id) {
    query = { _id: ObjectId(req.query.id) };
  } else if (req.query.name) {
    query = { name: req.query.name };
  }
  query
    ? Book.find(query)
        .exec()
        .then((doc) => {
          if (doc.length) {
            return res.status(200).json({
              book: doc,
            });
          }
          res.status(404).json({
            message: "No valid entry found",
          });
        })
        .catch((err) => {
          res.status(500).json(err);
        })
    : res.status(404).json({
        message: "Invalid entry",
      });
});

//** Add a book
router.post("/addBook", (req, res) => {
  console.log(req.body);
  Book.find({ name: req.body.name })
    .exec()
    .then((user) => {
      if (user.length) {
        return res.status(409).json({
          message: "Book exists",
        });
      }
      const book = new Book({
        name: req.body.name,
        genre: req.body.genre,
        author: req.body.author,
      });
      book
        .save()
        .then((result) => {
          //   console.log(result);
          res.status(201).json({
            message: "Book added",
          });
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    });
});

//** Delete a book by id or name
router.delete("/deletebook", (req, res) => {
  let query;
  if (req.query.id) {
    query = { _id: ObjectId(req.query.id) };
  } else if (req.query.name) {
    query = { name: req.query.name };
  }
  query
    ? Book.remove(query)
        .exec()
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.status(404).json({
              message: "Book not found",
            });
          }
          res.status(200).json({
            message: "Book deleted",
          });
        })
        .catch((err) => {
          res.status(500).json(err);
        })
    : res.status(404).json({
        message: "Book not found",
      });
});

//** Update a book by id or name
router.patch("/updatebook", (req, res) => {
  let query;
  if (req.query.id) {
    query = { _id: ObjectId(req.query.id) };
  } else if (req.query.name) {
    query = { name: req.query.name };
  }
  query
    ? Book.updateOne(query, { $set: req.body })
        .exec()
        .then((result) => {
          //   console.log(result);
          if (result.modifiedCount === 0) {
            return res.status(404).json({
              message: "Book not found",
            });
          }
          res.status(200).json({
            message: "Book updated",
          });
        })
        .catch((err) => {
          res.status(500).json(err);
        })
    : res.status(404).json({
        message: "Book not found",
      });
});

module.exports = router;
