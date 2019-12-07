const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    trim: true,
    maxlength: 50,
    required: [true, 'a name is required']
  },
  created: {
    type: Date,
    default: Date.now()
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

categorySchema.pre(/^find/, function (next) {
  // console.log(this);
  this.select("-__v");
  next();
})

const Category = mongoose.model("Category", categorySchema);


module.exports = Category;
