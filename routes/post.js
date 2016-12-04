var	cradle 				= require('cradle'),
		path          = require('path'),
    bodyParser    = require('body-parser');
    
var db = new(cradle.Connection)().database('foody');


/*
 * POST /posts
 *
 * POST POST
 */
exports.save = function(req, res){
	
};

/*
 * GET /posts/:post_id
 *
 * GET POST BY ID
 */
exports.getById = function(req, res){
	
};

/*
 * GET /posts
 *
 * GET ALL POSTS
 */
exports.get = function(req, res){
	
};

/*
 * PUT /posts/:post_id
 *
 * UPDATES POST BY ID
 */
exports.update = function(req, res){
	
};

/*
 * DELETE /posts/:post_id
 *
 * DELETE POST BY ID
 */
exports.delete = function(req, res){
	
};

