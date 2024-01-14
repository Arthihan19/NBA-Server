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

    getLeaderboard = async (req, res) => {
        try {
            const userId = req.user.id; // Assuming you get the user ID from the request
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
