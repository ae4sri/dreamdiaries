"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    title: { type: String, required: true, minlength: 5, maxlength: 30 },
    text: { type: String, required: true, minlength: 10, maxlength: 500 },
    date: { type: Date, required: true },
    priv: { type: Boolean, required: true },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    }
});
schema.set('toJSON', {
    transform: function (_document, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
var Diary = mongoose_1.model('DiaryEntry', schema);
exports["default"] = Diary;
