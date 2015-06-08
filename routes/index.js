var express = require('express');
var router = express.Router();
var rest = require('restler');
var app = express();
var config = require('../config');
var count = 5;

router.get('/', function(req, res, next) {
  rest.get(config.hostname + '/collections/blog/entry?count=' + count,
    {headers:
      {'apikey': config.publicapikey}
    }
  )
  .on('complete',function(data,response){
    res.render('index', { title: config.title, subtitle: "", entries: data, count: count, next: 1, previous: 0 });
  });
});

router.get('/page/:pageno', function(req, res, next) {
  var start = req.params.pageno * count;
  rest.get(
    config.hostname + '/collections/blog/entry?count=' + count + '&start=' + start,
    {headers:
      {'apikey': config.publicapikey}
    }
  )
  .on('complete',function(data,response){
    res.render('index', { title: config.title, subtitle:  'Home Page ' + req.params.pageno, entries: data, count: count, next: parseInt(req.params.pageno, 10) + 1, previous: parseInt(req.params.pageno, 10) - 1 });
  });
});

router.get('/blog/:id', function(req, res, next){
  rest.get(config.hostname + '/document/blog/entry/' + req.params.id,
    {headers:
      {'apikey': config.publicapikey}
    }
  )
  .on('complete',function(data,response){
    res.render('entry', { title: config.title, subtitle: data.title, entry: data });
  });
});

router.get('/category/:category', function(req, res, next) {
  var jsonData = {
    "filters": [{
      "operator": "contains",
      "field": "categories",
      "value": req.params.category
    }]
  };
  rest.postJson(config.hostname + '/search/blog/entry?count=100',
    jsonData,
    {headers:
      {'apikey': config.publicapikey}
    }
  )
  .on('complete',function(data,response){
    res.render('index', { title: config.title, subtitle: "Category: " + req.params.category, entries: data, count: count, next: null, previous: null });
  });
});

router.get('/tag/:tag', function(req, res, next) {
  var jsonData = {
    "filters": [{
      "operator": "contains",
      "field": "tags",
      "value": req.params.tag
    }]
  };
  rest.postJson(config.hostname + '/search/blog/entry?count=100',
    jsonData,
    {headers:
      {'apikey': config.publicapikey}
    }
  )
  .on('complete',function(data,response){
    res.render('index', { title: config.title, subtitle: "Tag: " + req.params.tag, entries: data, count: count, next: null, previous: null });
  });
});


module.exports = router;
