var express = require('express'),
  ejs = require('ejs'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  request = require('request');
  
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('site/index.ejs');
});

app.get('/search', function(req, res) {
  var query = req.query.searchTerm;
  var url = 'http://www.omdbapi.com/?s=' + query;

  request(url, function(error, response, body) {
    if (!error) {
      var data = JSON.parse(body);
      res.render('movies/results.ejs', {movieList: data.Search || []});
    }
  });
});

app.get('/movie/:id', function(req, res) {
  var movieID = req.params.id;
  var url = 'http://www.omdbapi.com/?i=' + movieID;
  request(url, function(error, response, body) {
    if (!error) {
      var data = JSON.parse(body);
      res.render('movies/details', {movie: data});
    }
  });
});

var savedMovies = [];

app.get('/watch-later', function(req, res) {
  res.render('movies/watch_later', {savedMovies: savedMovies});
});

app.post('/watch-later', function(req, res) {
  savedMovies.push(req.body.movie);
  res.redirect('/watch-later');
});

app.get('/movie/:id', function(req, res) {
  var movieID = req.params.id;
  var url = 'http://www.omdbapi.com/?i=' + movieID;
  request(url, function(error, response, body) {
    if (!error) {
      var data = JSON.parse(body);
      res.render('movies/details', {movie: data});
    }
  });
});

app.delete('/movie/:id', function(req, res){
  console.log(req.params.id);
  var movieID = Number(req.params.id);
  var movieIndex;
  savedMovies.forEach(function(movie, index){
     if(movie.imdbID === movieID) {
       movieIndex = index;
     }
  });
  savedMovies.splice(movieIndex, 1);
  res.redirect('/watch-later');
});

app.listen(3000, function() {
  console.log('server started on localhost:3000');
});




