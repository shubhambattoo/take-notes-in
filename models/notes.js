const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  text : {
    type: String,
    required: [true, "a note must have a text"],
    minlength: 2,
    trim: true
  },
  favorite:{
    type: Boolean,
    default: false
  },
  category: {
    type : mongoose.Schema.ObjectId,
    ref: "Category"
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "note must belong to a creator"]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Note = new mongoose.model('Note', notesSchema);

module.exports = Note;
