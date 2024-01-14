const express = require('express');
const { authToken } = require('../middlewares/auth.middleware');

const matchRouter = express.Router();

const MatchController = require('../controllers/match.controller');

module.exports = function() {
    matchRouter.get("/", authToken, MatchController.getSchedule);

    return matchRouter;
};
