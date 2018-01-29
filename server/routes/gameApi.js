var express = require('express');
var router = express.Router();
var gameService = require('../services/gameService');

// ======================================
// API routes
// ======================================

var routes = function (io) {
  // get games
  router.route('/game/all').get(function (req, res) {
    var game = gameService.getGamesList();

    res.setHeader('Content-Type', 'application/json');
    res.json(game);
  });

  // get game
  router.route('/game/:gameId').get(function (req, res) {
    var game = gameService.getGame(req.params.gameId);

    res.setHeader('Content-Type', 'application/json');
    res.json(game);
  });

  // create game
  router.route('/game').post(function (req, res) {
    var game = gameService.createGame();

    res.setHeader('Content-Type', 'application/json');
    res.json(game);
  });

  router.route('/game/join').post(function (req, res) {
    var data = request.body;
    var result = gameService.joinGame(data);

    res.setHeader('Content-Type', 'application/json');
    res.json(result);
  });

  return router;
}

module.exports = routes;
