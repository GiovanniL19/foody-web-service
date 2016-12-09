var	cradle 				= require('cradle'),
		path          = require('path'),
    bodyParser    = require('body-parser');
    
var db = new(cradle.Connection)().database('foody');

/*
 * GET /authenticate
 *
 * AUTHENTICATE USER
 */
exports.authenticate = function(req, res, next){
	var username = req.query.username;
  var password = req.query.password;
	var response = {
    user: null
  }
  
  if(username && password){
    db.view('user/userByUsername', {
      key: username,
      include_docs: true
    }, function(err, docs) {
      if (err || docs.length == 0) {
        console.log('Error: User not found');
        res.status(404).send("User not found");
      } else {
        var user = docs[0];
        console.log('Found user ' + user.key);
        if (password === user.doc.data.password) {
          console.log('Correct Password');
          response.user = user.doc.data;
          response.user.id = user.doc._id;
          console.log(user.doc._id);
          res.status(200).send(response);
        } else {
          console.log('Incorrect Password');
          res.status(404).send("Wrong Password");
        }
      }
    });
  }else{
    res.status(400).send("Bad request");
  }
};

/*
 * POST /users
 *
 * POST USER
 */
exports.save = function(req, res){
	var response = {
    user: null
  }
  if(req.body.username != "" || req.body.password != ""){
    newUser = {
      data: req.body
    }
    
    newUser.type = "User";
    newUser.data.memberDate = new Date();
    newUser.data.yums = []
    
    db.save(newUser, function (err, dbRes) {
      if(err){
        res.status(500).send(err)
      }else{
        response.user = newUser.data;
        response.user.id = dbRes.id
        res.status(201).send(response);
      }
    });
  }else{
    res.status(400).send('No username or password');
  }
};

/*
 * GET /users/:user_id
 *
 * GET USER BY ID
 */
exports.get = function(req, res){
	
};

/*
 * PUT /users/:user_id
 *
 * UPDATES USER BY ID
 */
exports.update = function(req, res){
	var userId = req.param('user_id');
  var user = {
    _id: userId,
    data: req.body,
    type: "User"
   }
   
   user.data.id = userId
   user.data.lastModified = Date.now();
   user.data.yums = []
   
   db.view('user/userById', {
     key: userId,
     include_docs: true
   }, function(err, docs) {
     if (err || docs.length == 0) {
       console.log('Error: User not found');
       res.status(404).send("User not found");
     } else {
       var foundUser = docs[0];
       user.data.yums = foundUser.doc.data.yums
       db.save(userId, user, function(err, dbRes) {
         if (err) {
           console.log('Could not update user');
           console.log(err);
           res.status(500).send(err);
         } else {
           console.log(userId + ' has been updated');
           var response = {
             user: null
           };
       
           response.user = req.body;
           response.user.id = userId;
           response.user.rev = dbRes.rev;
       
           res.status(200).send(response);
         }
       }); 
     }
   });
};

/*
 * DELETE /users/:user_id
 *
 * DELETE USER BY ID
 */
exports.delete = function(req, res){
  var userID = req.param('user_id');
	
  db.remove(userID, function(err, dbRes) {
    if (dbRes) {
      if (err) {
        console.log('There was a error: ');
        res.status(500).send(err);
      } else {
        console.log('Deleted user with id of: ' + userID);
        res.status(200).send({});
      }
    } else {
      res.status(404).send("404: Not found");
    }
  });
};

/*
 * GET /check?email=test@test.com&username=test
 *
 * Check if email or username exists in database
 */
exports.check = function(req, res){

};