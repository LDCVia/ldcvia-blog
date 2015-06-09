var express = require('express');
var router = express.Router();
var rest = require('restler');
var app = express();
var config = require('../config');
var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
var count = 5;


// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'], hostedDomain: 'ldcvia.com*' }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  }
);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/oauth2callback',
  passport.authenticate('google', { failureRedirect: '/login', hostedDomain: 'ldcvia.com*' }),
  function(req, res) {
    res.redirect('/');
  }
);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


router.get('/login', function(req, res){
  res.render('login', { title: config.title, subtitle: 'Login', user: req.user })
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    for (var i=0; i<req.user.emails.length; i++){
      if (req.user.emails[i].value.indexOf("@ldcvia.com") > -1){
        return next();
      }
    }
  }
  res.redirect('/login');
}

router.get('/', function(req, res, next) {
  rest.get(config.hostname + '/collections/blog/entry?count=' + count,
    {headers:
      {'apikey': config.publicapikey}
    }
  )
  .on('complete',function(data,response){
    res.render('index', { title: config.title, subtitle: "", entries: data, count: count, next: 1, previous: 0, user: req.user });
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
    res.render('index', { title: config.title, subtitle:  "", entries: data, count: count, next: parseInt(req.params.pageno, 10) + 1, previous: parseInt(req.params.pageno, 10) - 1, user: req.user });
  });
});

router.get('/blog/:id', function(req, res, next){
  rest.get(config.hostname + '/document/blog/entry/' + req.params.id,
    {headers:
      {'apikey': config.publicapikey}
    }
  )
  .on('complete',function(data,response){
    res.render('entry', { title: config.title, subtitle: data.title, entry: data, user: req.user });
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
    res.render('index', { title: config.title, subtitle: "Category: " + req.params.category, entries: data, count: count, next: null, previous: null, user: req.user });
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
    res.render('index', { title: config.title, subtitle: "Tag: " + req.params.tag, entries: data, count: count, next: null, previous: null, user: req.user });
  });
});

/* GET new post form */
router.get('/new', ensureAuthenticated, function(req, res, next) {
  res.render('newpost', { title: config.title, subtitle:  'New Post', user: req.user});
});

/* POST new form */
router.post('/new', ensureAuthenticated, function(req, res, next){
  var doc = {};
  doc.title = req.body.title;
  doc.categories = req.body.categories;
  if (doc.categories.indexOf(",") > -1){
    doc.categories = doc.categories.split(",");
  }else{
    doc.categories = [doc.categories];
  }
  doc.tags = req.body.tags;
  if (doc.tags.indexOf(",") > -1){
    doc.tags = doc.tags.split(",");
  }else{
    doc.tags = [doc.tags];
  }
  doc.body = req.body.body;
  doc.createdby = req.body.createdby;

  var unid = doc.title.replace(" ", "-");
  unid += "-" + new Date().getTime();
  rest.putJson(config.hostname + '/document/blog/entry/' + unid,
    doc,
    {headers:
      {'apikey': config.publicapikey}
    }
  )
  .on('complete',function(data,response){
    console.log(data);
    res.redirect("/");
  });
})


module.exports = router;
