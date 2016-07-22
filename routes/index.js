var express = require('express');
var router = express.Router();
var service = require('../data/service.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET front-end-assignment page. */
router.get('/front-end-assignment', function(req, res, next) {
  res.render('front-end-assignment');
});

/* REST api to get user */
router.get('/users',function(req, res, next) {
  service.getUserDetails(req.query.id,
      function(user,err) {
        if(user) {
          res.json(user);
        }
        else {
          res.status(500);
          res.json({
            "status": 500,
            "message": err.message
          });
        }
      }
  )});

/* REST api to get top active users */
router.get('/topActiveUsers',function(req, res, next) {
  service.getTopActiveUsers(req.query.page,function(list) {
    if(list == null)
    {
      res.status(500);
      res.json({
        "status": 500,
        "message": "Bad Request"
      });
    }
    else
      res.json(list);
  })
});


module.exports = router;
