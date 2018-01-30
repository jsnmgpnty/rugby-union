var express = require('express');
var router = express.Router();
var gameService = require('../services/gameService');

// ======================================
// API routes
// ======================================

var routes = function (io) {
  // get games
  router.route('/country/all').get(function (req, res) {
    var countries = gameService.getCountries();

    res.setHeader('Content-Type', 'application/json');
    res.json(countries);
  });

  // get country
  router.route('/country/:countryName').get(function (req, res) {
    var country = gameService.getCountry(req.params.countryName);

    res.setHeader('Content-Type', 'application/json');
    res.json(country);
  });

  return router;
}

module.exports = routes;
