var express = require('express');
var router = express.Router();

var path = require('path');

// server request handler
router.use(function (req, res, next) {
  console.log('Request from: ' + req.ip + ' | url: ' + req.originalUrl);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// main page request handler
router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../../build/', 'index.html'));
});
router.get('/join', function(req, res){
  res.sendFile(path.join(__dirname, '../../build/', 'index.html'));
});
router.get('/create', function(req, res){
  res.sendFile(path.join(__dirname, '../../build/', 'index.html'));
});
router.get('/game/:gameId', function(req, res){
  res.sendFile(path.join(__dirname, '../../build/', 'index.html'));
});
router.get('/game/:gameId/details', function(req, res){
  res.sendFile(path.join(__dirname, '../../build/', 'index.html'));
});

module.exports = router;
