var express 			= require('express'),
 		cradle 				= require('cradle'),
		path          = require('path'),
    bodyParser    = require('body-parser');

//var db = new(cradle.Connection)('http://52.89.48.249', 5984).database('foody');
var db = new(cradle.Connection)().database('foody');

var user = require('./routes/user.js');
var posts = require('./routes/post.js');
var yum = require('./routes/yum.js');

var port = 3002;
    
var app = express();

//support json and url encoded requests
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));

//Headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

//Welcome
app.get('/',function(req, res){
  res.status(200).send('Welcome to Foody API 1.0');
});

//Users
app.get('/auth', user.authenticate);
app.post('/users', user.save);
app.get('/users/:user_id', user.get);
app.put('/users/:user_id', user.update)
app.delete('/users/:user_id', user.delete);
app.get('/check', user.check);

//Posts
app.get('/postsByUser/:user_id', posts.getByUserId);
app.get('/posts', posts.get);
app.post('/posts', posts.save);
app.put('/posts/:post_id', posts.update);
app.delete('/posts/:post_id', posts.delete);

//Yum
app.post('/yums', yum.manage);
app.get('/yums/:user_id', yum.get);

app.listen(port);
console.log('Running on http://localhost:' + port);