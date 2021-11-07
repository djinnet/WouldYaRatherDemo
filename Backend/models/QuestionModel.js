const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    channelID: {
        type: String,
        required: true
    },
    optionA: {
        type: String,
        required: true
    },
    optionB: {
        type: String,
        required: true
    },
    UserPickOption: {
        type: Boolean,
        default: 0
    }
});

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;