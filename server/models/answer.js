let mongoose = require('mongoose');

let answerModel = mongoose.Schema({
    surveyID: String,
    questionID: String,
    responderPubDate: {type: Date, default: Date.now},
    responderAnswer: Boolean
},
{
    collection: "Answers"
});

module.exports = mongoose.model('Answer', answerModel);