var	cradle 				= require('cradle'),
		path          = require('path'),
    bodyParser    = require('body-parser'),
    async    			= require('async');
    
var db = new(cradle.Connection)().database('foody');


/*
 * YUM /yums
 *
 * YUM YUM
 */
exports.manage = function(req, res){
  //Get user
  console.log(req.body);
  db.view('user/userById', {
    key: req.body.user,
    include_docs: true
  }, function(err, docs) {
    if (err || docs.length == 0) {
      console.log('Error: User not found');
      res.status(404).send("User not found");
    } else {
      var foundUser = docs[0].doc;
      
      var user = {
        _id: foundUser._id,
        data: foundUser.data,
        type: "User"
      };
      
      user.data.id = foundUser._id
      
      var removed = false;
      user.data.yums.forEach(function(post){
        if(req.body.post == post){
          var index = user.data.yums.indexOf(post)
          user.data.yums.splice(index, 1);
          removed = true
          console.log('Removed post from user');
        }
      });
      
      if(removed == false){
        user.data.yums.push(req.body.post)
        console.log('Added post to user');
      }
      
      db.save(user._id, user, function(err, dbRes) {
        if (err) {
          console.log('Could not update user');
          console.log(err);
          res.status(500).send(err);
        } else {
          console.log(user._id + ' has been updated');
          var response = {
            user: null
          };
       
          if(removed){
            res.status(200).send(true);
          }else{
            res.status(201).send(true);
          }
        }
      });
      
    }
  });
};

/*
 * YUM /yums
 *
 * YUM YUM
 */
exports.get = function(req, res){
  var response = {
    posts: []
  }
  
  db.view('user/userById', {
    key: req.param('user_id'),
    include_docs: true
  }, function(err, docs) {
    if (err || docs.length == 0) {
      console.log('Error: User not found');
      res.status(404).send("User not found");
    } else {
      var foundUser = docs[0].doc;
      
      async.eachSeries(foundUser.data.yums, function(yum, nextYum) {
        console.log(yum)
        db.view('post/postById', {key: yum, include_docs: true}, function (err, docs) {
      		if(err){
            console.log(err);
      			res.status(500).send(err);
      		}else{
    		    docs.reverse().forEach(function(doc) {
              var item = doc.data;
      				item.id = doc._id;
      				response.posts.push(item); 
              nextYum();
            });
          }
        });
        
      }, function done(){
        res.status(200).send(response);
      });
    }
    
  });
}

/*
 * YUM /yums
 *
 * YUM YUM
 */
exports.getArray = function(req, res){
  var response = {
    posts: []
  }
  
  db.view('user/userById', {
    key: req.param('user_id'),
    include_docs: true
  }, function(err, docs) {
    if (err || docs.length == 0) {
      console.log('Error: User not found');
      res.status(404).send("User not found");
    } else {
      var foundUser = docs[0].doc;
      res.status(200).send(foundUser.data.yums);
    }
    
  });
}
