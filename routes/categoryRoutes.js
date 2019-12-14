const express = require("express");
const router = express.Router();

const categoryController = require("./../controllers/categoryController");
const authController = require("./../controllers/authController");

router.use(authController.protect);

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);

router
  .route("/:id")
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
