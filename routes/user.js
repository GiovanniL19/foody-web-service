var	cradle 				= require('cradle'),
		path          = require('path'),
    bodyParser    = require('body-parser');
    
var db = new(cradle.Connection)().database('foody');

/*
 * POST /authenticate
 *
 * AUTHENTICATE USER
 */
exports.authenticate = function(req, res, next){
	
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
    newUser.memberDate = new Date();
    
    
    db.save(newUser, function (err, dbRes) {
      if(err){
        res.status(500).send(err)
      }else{
        response.user = dbRes.data;
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
	
};

/*
 * DELETE /users/:user_id
 *
 * DELETE USER BY ID
 */
exports.delete = function(req, res){
	
};

/*
 * GET /check?email=test@test.com&username=test
 *
 * Check if email or username exists in database
 */
exports.check = function(req, res){

};