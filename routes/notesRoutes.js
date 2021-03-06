const express = require("express");
const router = express.Router();

const notesController = require("./../controllers/notesController");
const authController = require("./../controllers/authController");

router.use(authController.protect);

router
  .route("/")
  .get(notesController.getAllNotes)
  .post(notesController.createNote);

router
  .route("/:id")
  .get(notesController.getNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote);

module.exports = router;
