const Notes = require("./../models/notes");

const handlerFactory = require("./handlerFactory");

exports.getAllNotes = handlerFactory.getAll(Notes, "notes");
exports.createNote = handlerFactory.createOne(Notes, "note");
exports.getNote = handlerFactory.getOne(Notes, null, "note");
exports.updateNote = handlerFactory.updateOne(Notes, "note");
exports.deleteNote = handlerFactory.deleteOne(Notes);

