const Category = require("./../models/categories");
const handlerFactory = require("./handlerFactory");

exports.getAllCategories = handlerFactory.getAll(Category, "category");
exports.createCategory = handlerFactory.createOne(Category, "category");
exports.updateCategory = handlerFactory.updateOne(Category, "category");
exports.deleteCategory = handlerFactory.deleteOne(Category, "category");
