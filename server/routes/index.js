var express = require('express');
var router = express.Router();

var path = require('path');

// server request handler
router.use(function (req, res, next) {
  console.log('Request from: ' + req.ip + ' | url: ' + req.originalUrl);
  next();
});

// main page request handler
router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../../build/', 'index.html'));
});

module.exports = router;
