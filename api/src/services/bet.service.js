const BetRepository = require('../repositories/bet.repository');

class BetService {
    constructor() {
        this.betRepository = BetRepository;
    }

    async placeBet(betData) {
        return await this.betRepository.placeBet(betData);
    }

    async findBetsByUser(userId, options) {
        return await this.betRepository.findBetsByUser(userId, options);
    }
}

module.exports = new BetService();
