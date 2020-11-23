let mongoose = require('mongoose');

let thirtyDaysFromNow = ()=>{
    // Gets the millisecond equivalent of 30 days from now
    let date = new Date(Date.now()+ 30*24*60*60*1000);
    return date;
};

let surveyModel = mongoose.Schema({
    authorName: String,
    surveyName: String,
    authorPubDate: {type: Date, default: Date.now},
    expiryDate: {type:Date, default: thirtyDaysFromNow}
},
{
    collection: "Surveys"
});


module.exports = mongoose.model('Survey', surveyModel);
