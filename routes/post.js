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
	var response = {
    post: null
  }
  newPost = {
    data: req.body
  }
  
  newPost.type = "Post";
  newPost.data.date = new Date();
  
  
  db.save(newPost, function (err, dbRes) {
    if(err){
      res.status(500).send(err)
    }else{
      response.post = newPost.data;
      response.post.id = dbRes.id
      res.status(201).send(response);
    }
  });
};

/*
 * GET /postsByUser/:user_id
 *
 * GET POSTS BY USER ID
 */
exports.getByUserId = function(req, res){
  var userId = req.param('user_id');
  var response = {
    posts: []
  }
  
  db.view('user/userById', {
    key: userId,
    include_docs: true
  }, function(err, docs) {
    if (err || docs.length == 0) {
      console.log('Error: User not found');
      res.status(404).send("User not found");
    } else {
      var user = docs[0];
      
      user.doc.data.yum.forEach(function(postID){
        db.view('post/postById', {
          key: postID,
          include_docs: true
        }, function(err, docs) {
          if (err || docs.length == 0) {
            console.log('Error: User not found');
            res.status(404).send("User not found");
          } else {
            response.push(docs[0].doc.data);
          }
        });
      });
      res.status(200).send(response);
    }
  });
};

/*
 * GET /posts
 *
 * GET ALL POSTS
 */
exports.get = function(req, res){
  var response = {
    posts: []
  }
  
  db.view('post/postByDate', {include_docs: true}, function (err, docs) {
		if(err){
      console.log(err);
			res.status(500).send(err);
		}
		if(docs){
		    docs.reverse().forEach(function(doc) {
        var item = doc.data;
				item.id = doc._id;
				response.posts.push(item); 
      });
      res.status(200).send(response);
    }else{
      res.status(500).send(err);
    }
  });
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
  var postID = req.param('post_id');
	
  db.remove(postID, function(err, dbRes) {
    if (dbRes) {
      if (err) {
        console.log('There was a error: ');
        res.status(500).send(err);
      } else {
        console.log('Deleted post with id of: ' + postID);
        res.status(200).send({});
      }
    } else {
      res.status(404).send("404: Not found");
    }
  });
};

