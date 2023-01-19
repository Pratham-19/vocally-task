const express = require("express");
const router = express.Router();
var ObjectId = require("mongodb").ObjectID;
const Book = require("../models/books");

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - name
 *         - genre
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         name:
 *           type: string
 *           description: The book title
 *         genre:
 *           type: string
 *           description: The book genre
 *         author:
 *           type: string
 *           description: The book author
 *       example:
 *         name: Vocally Hire Me
 *         genre: Career
 *         author: Pratham Singhal
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Returns the list of all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

//** List all books
router.get("/", (req, res) => {
  Book.find()
    .exec()
    .then((docs) => {
      //   console.log(docs);
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
/**
 * @swagger
 * /books/book?id={id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */
/**
 * @swagger
 * /books/book?name={name}:
 *   get:
 *     summary: Get the book by name
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The book name
 *     responses:
 *       200:
 *         description: The book description by name
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */
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

/**
 * @swagger
 * /books/addBook:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       409:
 *        description: The book already exists
 *       500:
 *         description: Some server error
 */

router.post("/addBook", (req, res) => {
  //   console.log(req.body);
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
/**
 * @swagger
 * /books/deleteBook?id={id}:
 *  delete:
 *    summary: Delete the book by the id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The book id
 *    responses:
 *      200:
 *        description: The book was deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Some error happened
 */
/**
 * @swagger
 * /books/deleteBook?name={name}:
 *  delete:
 *    summary: Delete the book by name
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: name
 *        schema:
 *          type: string
 *        required: true
 *        description: The book name
 *    responses:
 *      200:
 *        description: The book was deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Some error happened
 */
router.delete("/deleteBook", (req, res) => {
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
/**
 * @swagger
 * /books/updateBook?id={id}:
 *  patch:
 *    summary: Update the book by the id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The book id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Some error happened
 */
/**
 * @swagger
 * /books/updateBook?name={name}:
 *  patch:
 *    summary: Update the book by name
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: name
 *        schema:
 *          type: string
 *        required: true
 *        description: The book name
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Some error happened
 */
router.patch("/updateBook", (req, res) => {
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
              message: "Book not updated",
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
