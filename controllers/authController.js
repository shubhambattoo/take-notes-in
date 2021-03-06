const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const User = require("./../models/user");

const signToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createAndSendToken = (user, statusCode, res, sendUser = false) => {
  const token = signToken(user._id, user.email);

  user.password = null;

  let response = {
    status: "ok",
    token
  };
  response = sendUser ? { ...response, data: { user } } : response;
  res.status(statusCode).json(response);
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  });
  // const url = `${req.protocol}://${req.get("host")}/me`;
  // await new Email(newUser, url).sendWelcome();
  createAndSendToken(newUser, 201, res, true);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(`please provide email and password`, 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError(`Incorrect email or password`, 401));
  }
  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting Token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("you are not logged in", 401));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("This user belonging to the token doesnt exits", 401)
    );
  }

  // 4) Check if user changed password after the JWT was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please login again", 401)
    );
  }

  // Grant access to the protected route
  // eslint-disable-next-line require-atomic-updates
  req.user = currentUser;
  next();
});

exports.restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  // get user from collection
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new AppError("user not found", 404));
  }
  // check if posted current password is correct
  const isCorrect = await user.comparePassword(
    req.body.passwordCurrent,
    user.password
  );

  if (!isCorrect) {
    return next(new AppError("passwords do not match with the current", 401));
  }
  // if so update password
  user.password = req.body.password;
  await user.save();
  // log user in send JWT
  createAndSendToken(user, 201, res);
});
