const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.URL;
// const mainURL = "mongodb+srv://classBuild:classBuild@cluster0.75kqx.mongodb.net/classBuildTest?retryWrites=true&w=majority

mongoose.connect(url).then(() => {
  console.log("Database is now connected...!");
});

module.exports = mongoose;
