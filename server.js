const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = process.env.PORT || 3003;
const cors = require("cors");
require("dotenv").config();
const bookRouter = require("./api/routes/books");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/books", bookRouter);

try {
  mongoose.connect(
    `mongodb+srv://root:${process.env.MONGODB_ATLAS_KEY}@testcluster.d8tzrhx.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  );
  console.log("Connected to MongoDB!");
} catch (err) {
  console.log(err);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
