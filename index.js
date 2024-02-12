const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const connect = require("./config/db/index");
const setupLogging = require("./config/logging/index");

const app = express();
const route = require("./routes/index");
const feedbackRoute = require("./routes/feedback.routes");
const memoryStore = new session.MemoryStore();

// SESSION
app.use(
  session({
    secret: "any",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

// DOT ENV
dotenv.config();

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(route);
app.use("/services/feedback", feedbackRoute);
const port = process.env.NODE_PORT;
//test DB connection
connect.testDatabaseConnection();
setupLogging(app);
app.listen(port, () => {
  console.log(`Flash sync app listening on port ${port}`);
});
