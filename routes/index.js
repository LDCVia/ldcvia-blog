var express = require('express');
var router = express.Router();
var rest = require('restler');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("Getting home page...");
  // direct way

  rest.get('https://eu.ldcvia.com/1.0/collections/blog/entry', {headers: {'apikey': '8dc950a4dfe6ccb45d2470906dff00a2'}})
    .on('timeout', function(ms){
      console.log('did not return within '+ms+' ms');
    })
    .on('complete',function(data,response){
      res.render('index', { title: 'Blog', entries: data });
    });



});

module.exports = router;
