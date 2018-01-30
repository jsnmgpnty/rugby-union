const express = require('express');
const router = express.Router();
const GameService = require('../services/gameService');
const gameService = new GameService();

// ======================================
// API routes
// ======================================

const routes = function () {
  // get games
  router.get('/game/all', async (req, res) => {
    var game = await gameService.getGamesList();

    res.setHeader('Content-Type', 'application/json');
    res.json(game);
  });

  // get game
  router.get('/game/:gameId', async (req, res) => {
    var game = await gameService.getGame(req.params.gameId);

    res.setHeader('Content-Type', 'application/json');
    res.json(game);
  });

  // create game
  router.post('/game', async (req, res) => {
    try {
      var data = req.body;
      var game = await gameService.createGame(data);

      res.setHeader('Content-Type', 'application/json');
      res.json(game);
    } catch (error) {
      console.log(error);
    }
  });

  router.post('/game/join', async (req, res) => {
    var data = request.body;
    var result = await gameService.joinGame(data);

    res.setHeader('Content-Type', 'application/json');
    res.json(result);
  });

  return router;
}

module.exports = routes;
