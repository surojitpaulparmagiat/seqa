const express = require("express");

// just importing these files will run the code inside them
// 1. connect to database
// 2. create the tables
require("./dbConfig/dbConnection");
require("./models");
const api_router = require("./routes");

// create a basic express server
const app = express();

app.use(express.json());
app.use("/api", api_router);

app.listen(5030, () => {
  console.log("Server is running on port 5030");
});
