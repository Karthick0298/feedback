const morgan = require("morgan");

const setupLogging = (app) => {
  app.use(morgan("combined"));
  app.use(morgan("dev"));
};

module.exports = setupLogging;
