var express = require('express');
var router = express.Router();
var rest = require('restler');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("Getting home page...");
  // direct way

  rest.get('https://eu.ldcvia.com/1.0/collections/blog/entry', {headers: {'apikey': 'ffcb216445defbf0450dc1719a5a5117'}})
    .on('timeout', function(ms){
      console.log('did not return within '+ms+' ms');
    })
    .on('complete',function(data,response){
      res.render('index', { title: 'Blog', entries: data });
    });



});

module.exports = router;
