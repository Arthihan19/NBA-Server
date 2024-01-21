const BetRepository = require('../repositories/bet.repository');

class BetService {
    constructor() {
        this.betRepository = BetRepository;
    }

    async placeBets(userId, betsArray) {
        return await this.betRepository.placeBets(userId, betsArray);
    }

    async findBetsByUser(userId, options) {
        return await this.betRepository.findBetsByUser(userId, options);
    }
}

module.exports = new BetService();
