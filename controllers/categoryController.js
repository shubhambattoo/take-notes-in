const Category = require("./../models/categories");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllCategories = catchAsync(async (req, res, next) => {
  let categories = await Category.find().sort("name");

  res.status(200).json({
    status: "ok",
    data: {
      categories
    },
    results: categories.length
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  let category = { name: req.body.name };
  category = await Category.create(category);

  const response = {
    status: "ok",
    data: {
      category
    }
  };
  res.status(201).json(response);
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!category) {
    return next(new AppError("No document with the ID found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      category
    }
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError("No document with the ID found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null
  });

});
