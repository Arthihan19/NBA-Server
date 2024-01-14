const BetService = require('../services/bet.service');

class BetController {
    constructor() {
        this.betService = BetService;
    }

    asyncWrapper(fn) {
        return async (req, res, next) => {
            try {
                await fn(req, res, next);
            } catch (error) {
                next(error);
            }
        };
    }

    placeBet = this.asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const { gameId, teamId, betAmount, odds } = req.body;

        const bet = await this.betService.placeBet({ userId, gameId, teamId, betAmount, odds });
        res.status(201).json(bet);
    });

    getBetsByUser = this.asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const { state, page, pageSize } = req.query;

        const options = {
            state,
            page: page ? parseInt(page, 10) : 0,
            pageSize: pageSize ? Math.min(parseInt(pageSize, 10), 100) : 20
        };

        const bets = await this.betService.findBetsByUser(userId, options);
        res.status(200).json(bets);
    });
}

module.exports = new BetController();
