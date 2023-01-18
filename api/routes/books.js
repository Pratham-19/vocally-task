const express = require("express");
const router = express.Router();
const Book = require("../models/books");

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
          console.log(result);
          res.status(201).json({
            message: "Book added",
            // book: result,
          });
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    });
});

module.exports = router;
