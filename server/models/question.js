let mongoose = require('mongoose');

let questionsModel = mongoose.Schema({
    surveyID: String,
    questionsNumber: String,
    question: String
},
{
    collection: "Questions"
});
module.exports = mongoose.model('Question', questionsModel);