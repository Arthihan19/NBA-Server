const express = require('express');
const matchRouter = express.Router();

const MatchController = require('../controllers/match.controller');

module.exports = function() {
    matchRouter.get("/", MatchController.getSchedule);

    return matchRouter;
};
