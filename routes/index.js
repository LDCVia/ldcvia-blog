var express = require('express');
var router = express.Router();
var rest = require('restler');

/* GET home page. */
router.get('/', function(req, res, next) {
  rest.get('https://eu.ldcvia.com/1.0/collections/blog/entry', {headers: {'apikey': 'ffcb216445defbf0450dc1719a5a5117'}})
    .on('timeout', function(ms){
      console.log('did not return within '+ms+' ms');
    })
    .on('complete',function(data,response){
      res.render('index', { title: 'Blog', entries: data });
    });
});

router.get('/:id', function(req, res, next){
  rest.get('https://eu.ldcvia.com/1.0/document/blog/entry/' + req.params.id, {headers: {'apikey': 'ffcb216445defbf0450dc1719a5a5117'}})
    .on('timeout', function(ms){
      console.log('did not return within '+ms+' ms');
    })
    .on('complete',function(data,response){
      res.render('entry', { title: data.title, entry: data });
    });
});

module.exports = router;
