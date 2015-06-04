var express = require('express');
var router = express.Router();
var rest = require('restler');
var app = express();
var config = require('../config');
var count = 5;

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(config.hostname + '/collections/blog/entry?count=' + count);
  rest.get(config.hostname + '/collections/blog/entry?count=' + count, {headers: {'apikey': config.publicapikey}})
  .on('complete',function(data,response){
    console.log(data);
    res.render('index', { title: 'Blog', entries: data, count: count, next: 1, previous: 0 });
  });
});

router.get('/page/:pageno', function(req, res, next) {
  var start = req.params.pageno * count;
  rest.get(config.hostname + '/collections/blog/entry?count=' + count + '&start=' + start, {headers: {'apikey': config.publicapikey}})
  .on('complete',function(data,response){
    res.render('index', { title: 'Blog', entries: data, count: count, next: parseInt(req.params.pageno, 10) + 1, previous: parseInt(req.params.pageno, 10) - 1 });
  });
});

router.get('/blog/:id', function(req, res, next){
  rest.get(config.hostname + '/document/blog/entry/' + req.params.id, {headers: {'apikey': config.publicapikey}})
  .on('complete',function(data,response){
    res.render('entry', { title: data.title, entry: data });
  });
});

module.exports = router;
