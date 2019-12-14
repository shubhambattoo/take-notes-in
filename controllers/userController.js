const User = require("./../models/user");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

const filterObj = function(obj, ...allowed) {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowed.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // if the user tries to update password : ERROR
  if (req.body.password) {
    return next(new AppError("Cannot update password with this one", 400));
  }

  if (req.body.email) {
    return next(new AppError("Cannot update email", 400));
  }

  // update the user document
  const user = filterObj(req.body, "firstName", "lastName");
  //   if (req.file) user.photo = req.file.filename;

  const upUser = await User.findByIdAndUpdate(req.user.id, user, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: "ok",
    data: {
      user: upUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "ok",
    data: null
  });
});

exports.getMe = (req, res, next) => {
  // console.log("came here");
  req.params.id = req.user.id;
  next();
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not defined, use api/user/signup instead"
  });
};

// For Admins Mostly
exports.getUsers = factory.getAll(User, "users");
exports.getUser = factory.getOne(User, null, "user");
// Do NOT Update passwords with this
exports.updateUser = factory.updateOne(User, "user");
exports.deleteUser = factory.deleteOne(User);
