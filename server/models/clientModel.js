const mongoose = require("mongoose");

const TagModel = require("./tagModel.js");

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    body: { type: String, required: true },
});

const clientSchema = new Schema({
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photoURL: { type: String },
    userReference: { type: String, required: true },
    tag: { type: String },
    notes: [],
});

const ClientModel = mongoose.model("client", clientSchema);
const NoteModel = mongoose.model("note", noteSchema);

module.exports = {
    ClientModel,
    NoteModel,
};