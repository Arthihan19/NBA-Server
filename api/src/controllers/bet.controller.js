const BetService = require('../services/bet.service');
const UserService = require('../services/user.service');

class BetController {
    constructor() {
        this.betService = BetService;
        this.userService = UserService;
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
        const betsArray = req.body;

        const placedBets = [];

        for (const bet of betsArray) {
            const placedBet = await this.betService.placeBet({
                userId,
                gameId: bet.gameId,
                teamId: bet.teamId,
                betAmount: bet.betAmount,
                odds: bet.odds
            });

            placedBets.push(placedBet);
        }

        res.status(201).json(placedBets);
    });

    getBetsByUser = this.asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const { state, page, pageSize, beforeDate, afterDate } = req.query;

        const options = {
            state,
            page: page ? parseInt(page, 10) : 0,
            pageSize: pageSize ? Math.min(parseInt(pageSize, 10), 100) : 20,
            beforeDate,
            afterDate
        };

        const bets = await this.betService.findBetsByUser(userId, options);
        res.status(200).json(bets);
    });

    getLeaderboard = async (req, res) => {
        try {
            const userId = req.user.id;
            const { page, pageSize } = req.query;

            const leaderboard = await this.userService.getLeaderboard({ page, pageSize });
            const userPlacing = await this.userService.getUserPlacing(userId);
            const userStats = leaderboard.find(user => user.userId === userId);

            res.status(200).json({
                leaderboard,
                userStats,
                userPlacing
            });
        } catch (error) {
            res.status(500).send({ message: 'Error fetching leaderboard: ' + error.message });
        }
    };
}

module.exports = new BetController();
