const express = require('express');
const betRouter = express.Router();

const BetController = require('../controllers/bet.controller');
const {authToken} = require('../middlewares/auth.middleware');

module.exports = function () {
    betRouter.post('/', authToken, BetController.placeBet);
    betRouter.get('/', authToken, BetController.getBetsByUser);
    betRouter.get('/leaderboard', authToken, BetController.getLeaderboard)

    return betRouter;
};
