const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json({ limit: "10kb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

module.exports = app;
