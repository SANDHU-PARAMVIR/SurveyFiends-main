let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// connect to our Survey Model
let Survey = require('../models/survey');
let Question = require('../models/question');
let Answer = require('../models/answer');

router.get('*', (req, res, next) => {
  if(!req.session.isLoggedIn)
    res.redirect("/users/login");
  else
    next();
});

/* GET Route for the Survey List page - READ OPeration */
router.get('/', (req, res, next) => {
    Survey.find((err, surveyList) => {
        if(err)
        {
            return console.error(err);
        }
        else
        {
            //console.log(surveyList);

            res.render('survey/list', {title: 'Survey List', SurveyList: surveyList, isLoggedIn:(req.session.isLoggedIn)?true:false});           
        }
    });
});

router.get('/add', (req, res, next) => {
 
    Survey.find((err, surveyList) => {
        if(err)
        {
            return console.error(err);
        }
        else
        {
            //console.log(surveyList);
            res.render('survey/details', {title: 'Add New Survey', SurveyList: surveyList, isLoggedIn:(req.session.isLoggedIn)?true:false});            
        }
     });
  
});

router.post('/add', (req, res, next) => {
    let newSurvey = Survey({
        "surveyName": req.body.name,
        "authorName": req.body.author,
    });

    Survey.create(newSurvey, (err, Survey) =>{
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else 
        {
            //refresh list by redirec
            res.redirect('/survey-list/'+Survey._id);
        }
    });
});

router.get('/:id', (req, res, next) => {
  
    //Finding specified book by ID and passing it to details view
    let id = req.params.id;
  
    Survey.findById(id, (err, surveyToEdit) =>{
        if(err)
        {
            console.log(err);
            res.end(err); 
        }
        else
        {
          Question.find({surveyID: id}).sort("questionsNumber").exec((err, questions) =>{
            res.render('survey/details', {title: 'Edit Survey Details', SurveyList: surveyToEdit, Questions: questions, isLoggedIn:(req.session.isLoggedIn)?true:false});
          });
        }
    });
  });
  
  // POST - process the information passed from the details form and update the document
  router.post('/:id', (req, res, next) => {
  
    //Transfer of new book values/edited book values to the book that matches the passed ID
    let id = req.params.id;
  
    let editedSurvey = Survey({
      "_id": id,
      "surveyName": req.body.name,
      "authorName": req.body.author,
    });
  
    Survey.updateOne({_id: id}, editedSurvey, (err) =>{
      if(err)
      {
        console.log(err);
        res.end(err);
      }
      else
        {
          res.redirect('/survey-list');
        }
     });
  });
  
  
  
  // GET - process the delete by user id
  router.get('/delete/:id', (req, res, next) => {
  
    //removal of book that matches passed ID
    let id = req.params.id;
  
    Survey.remove({_id: id}, (err) =>{
      if(err)
      {
        console.log(err);
        res.end(err);
      }
      else 
      {
      res.redirect('/survey-list')
      }
    });
  
  });


  /* Question routes */

  router.get('/:id/addQuestions', (req, res, next) => {
    let id = req.params.id;

    Question.find({surveyID: id}, (err, questionList) =>{
        if(err)
        {
            console.log(err);
            res.end(err); 
        }
        else
        {
            res.render('survey/addQuestions', {title: 'Add Question', Question:"", SurveyID:id, isLoggedIn:(req.session.isLoggedIn)?true:false});
        }    
    });
  });

  
  router.post('/:id/addQuestions', (req, res, next) => {
  
    let id = req.params.id;
  
    let newQuestion = Question({
      "surveyID": id,
      "questionsNumber": req.body.questionsNumber,
      "question": req.body.question
    });
  
    Question.create(newQuestion, (err, Question) =>{
      if(err)
      {
        console.log(err);
        res.end(err);
      }
      else
        {
          res.redirect('/survey-list/'+id);
        }
     });
  });
  
  router.get('/:id/editQuestions/:questionID', (req, res, next) => {
  
    let questionid = req.params.questionID;
    let surveyid = req.params.id;
  
    Question.findById(questionid, (err, questionToEdit) =>{
        if(err)
        {
            console.log(err);
            res.end(err); 
        }
        else
        {
            res.render('survey/addQuestions', {title: 'Edit Question', Question: questionToEdit, SurveyID: surveyid, isLoggedIn:(req.session.isLoggedIn)?true:false});
        }
    });
  });
  
  // POST - process the information passed from the details form and update the document
  router.post('/:id/editQuestions/:questionID', (req, res, next) => {
  
    //Transfer of new book values/edited book values to the book that matches the passed ID
    let id = req.params.id;
    let questionid = req.params.questionID;
  
    let editQuestion = Question({
      "_id": questionid,
      "surveyID": id,
      "questionsNumber": req.body.questionsNumber,
      "question": req.body.question,
    });
  
    Question.updateOne({_id: questionid}, editQuestion, (err) =>{
      if(err)
      {
        console.log(err);
        res.end(err);
      }
      else
        {
          res.redirect('/survey-list/'+id);
        }
     });
  });

  router.get('/deleteQuestion/:id/:questionID', (req, res, next) => {
  
    //removal of question that matches passed ID
    let questionid = req.params.questionID;
    let surveyID = req.params.id;
  
    Question.remove({_id: questionid}, (err) =>{
      if(err)
      {
        console.log(err);
        res.end(err);
      }
      else 
      {
        res.redirect("/survey-list/"+surveyID);
      }
    });
  
  });
  
  

module.exports = router;