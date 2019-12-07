const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  text : {
    type: String,
    required: [true, "a note must have a text"],
    minlength: 2,
    trim: true
  },
  created : {
    type: Date,
    default : Date.now()
  },
  updated : {
    type: Date,
    default : Date.now()
  },
  favorite:{
    type: Boolean,
    default: false
  },
  category: {
    type : mongoose.Schema.ObjectId,
    ref: "Category"
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Note = new mongoose.model('Note', notesSchema);

module.exports = Note;
