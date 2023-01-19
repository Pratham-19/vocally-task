const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const port = process.env.PORT || 3003;
require("dotenv").config();
const bookRouter = require("./api/routes/books");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(
  "/api",
  rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: "Too many requests from this IP, please try again after 5 minutes",
  })
);

const options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library Api",
      description: "Library API Information",
      version: "1.0.0",
    },
  },
  apis: ["./api/routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api", bookRouter);

mongoose
  .connect(`mongodb://mongo:27017/bookApi`, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
