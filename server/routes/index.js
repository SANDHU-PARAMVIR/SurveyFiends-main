let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// connect to our Survey Model
let Survey = require('../models/survey');
let Question = require('../models/question');
let Answer = require('../models/answer');

// Helper function to convert string to boolean
let checkIfBool = (toCheck)=>{
  if(toCheck == 'true'){
    return true;
  }else{
    return false;
  }
}

function restrict(req, res, next){
  
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', isLoggedIn:(req.session.isLoggedIn)?true:false});
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home', isLoggedIn:(req.session.isLoggedIn)?true:false});
});

/* GET About Us page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About', isLoggedIn:(req.session.isLoggedIn)?true:false});
});

/* GET openSurveysList page. */
router.get('/openSurveysList', function(req, res, next) {
  let now = Date.now();
  // finds all surveys that have expiry dates later than current date.
  Survey.find({expiryDate: {$gte: now}}).exec((err, openSurveys)=>{
    if(err){
      return console.log(err);
    }else{
      res.render('openSurveys/openSurveysList', { title: 'Open Surveys', Surveys: openSurveys, isLoggedIn:(req.session.isLoggedIn)?true:false});
    };
  });
});

/* GET selected survey page */
router.get('/openSurveysList/:id', (req, res, err)=>{
  let surveyid = req.params.id;
  Survey.findById(surveyid, (err, survey) => {
    if(err){
      return console.log(err);
    }else{
      // Gets all questions in the survey and sorts them in numberial order
      Question.find({surveyID: surveyid}).sort('questionsNumber').exec((err, SurveyQuestions)=>{
        if(err){
          return console.log(err);
        }else{
          //res.location(SurveyQuestions[0]._id); -- Error 
          res.render('openSurveys/displaySurvey',{title:'Open Surveys', Survey: survey, Questions: SurveyQuestions, isLoggedIn:(req.session.isLoggedIn)?true:false});
        }
      })
    }
  })
})

/*  POST Method for selected Survey  */
    //only updates the database as of now. Will show stats of survey with next release
router.post('/openSurveysList/:id', (req, res, err)=>{
  let surveyid = req.params.id;
  let postValues = Object.values(req.body);
  //console.log(postValues);
  let count = 0;
  let toInsert = [];

  // populate array with docs for the Answer model
  while(count < postValues.length){
    toInsert.push({surveyID: surveyid, questionID:postValues[count], responderAnswer:checkIfBool(postValues[count+1])});
    //console.log(count);
    count += 2;
  }

  // inserting docs array to collections
  Answer.collection.insertMany(toInsert, (err, result)=>{
    if(err){
      return console.log(err);
    }else{
      res.redirect('/openSurveysList')
    }
  })


          // Kept So I could try to make it work later
          // Most likely didn't work due to async nature of Mongoose
          //
          //                                      -- Parth Shreyash Patel

                                  /* for(let count = 0; count < postValues.length; count + 2){
                                    let submittedAnswer = Answer({
                                      "surveyID": surveyid,
                                      "questionID": postValues[count],
                                      "responderAnswer": checkIfBool(postValues[count+1])
                                    });

                                    Answer.create(submittedAnswer, (err, answer)=>{
                                      if(err){
                                        console.log(err);
                                        res.end(err);
                                      };
                                    });

                                  }; */
                                  //res.redirect('/openSurveysList'); 

});

module.exports = router;
