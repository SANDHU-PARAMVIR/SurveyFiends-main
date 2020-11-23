var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET User Registration */
router.get('/register', function(req, res, next) {
  res.render('register',{
    title:"Registration",
    statusText:"", isLoggedIn:(req.session.isLoggedIn)?true:false
  });
});

/* GET User Login */
router.get('/login', function(req, res, next) {
  console.log("LOGGED IN: "+req.session.isLoggedIn);
  if(req.session.isLoggedIn==true)
    res.redirect("/survey-list");

  res.render('login',{
    title:"Login",
    statusText:"", isLoggedIn:(req.session.isLoggedIn)?true:false
  });
});

/* POST User Registration */
router.post('/register', function(req, res, next) {

  var name=req.body.name;
  var email=req.body.email;
  var password=req.body.password;
  var cpassword=req.body.cpassword;

  if(name && email && password){
    //Passwords are equal
    if(password===cpassword){
      User.create({
        name: name,
        email: email,
        password: password
      }, (err, doc)=>{
        if(err){
          res.render('register',{
            title:"Registration",
            statusText:"Failed to Register (Internal Error)", isLoggedIn:(req.session.isLoggedIn)?true:false
          });
        } 
        else{
          res.render('register',{
            title:"Registration",
            statusText:"User Created", isLoggedIn:(req.session.isLoggedIn)?true:false
          });
        }
      });
    }
    else{
      res.render('register',{
        title:"Registration",
        statusText:"Passwords do not match", isLoggedIn:(req.session.isLoggedIn)?true:false
      });
    }
  }
  //Fields are empty
  else{
    res.render('register',{
      title:"Registration",
      statusText:"All Fields are required", isLoggedIn:(req.session.isLoggedIn)?true:false
    });
  }
});

/* POST User Login */
router.post('/login', function(req, res, next) {
  var email=req.body.email;
  var password=req.body.password;

  User.findOne({
    email:email,
    password:password
  },(err, doc)=>{
    if(err || !doc){
      //Failed to Login
      res.render('login',{
        title:"Login",
        statusText:"Credentials Invalid", isLoggedIn:(req.session.isLoggedIn)?true:false
      });
    }
    else{
      //Logged In
      req.session.email=doc.email;
      req.session.isLoggedIn=true;

      req.session.save(()=>{
        res.redirect("/survey-list");
      });
    }
  });
});

/* POST Logout */
router.get('/logout', (req,res,next)=>{
  req.session.destroy(function(err) {
    res.redirect('/users/login');
  });
});


module.exports = router;
