const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const categoryRoutes = require("./routes/categoryRoutes");
const notesRoutes = require("./routes/notesRoutes");

const app = express();

app.use(express.json({ limit: "10kb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/category", categoryRoutes);
app.use("/api/notes", notesRoutes);

app.use("*", (req, res, next) => {
  return next(new AppError('Not Found', 404))
})

app.use(globalErrorHandler);

module.exports = app;
