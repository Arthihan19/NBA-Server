const APIError = require('../errors/api.error');

const MatchRepository = require('../repositories/match.repository');

class MatchService {
    /**
     * Gets the schedule with optional filtering and pagination.
     *
     * @param {Object} options
     * @param {Date} [options.beforeDate] - Fetch matches before this date.
     * @param {Date} [options.afterDate] - Fetch matches after this date.
     * @param {number} [options.page=0] - Page number for pagination.
     * @param {number} [options.pageSize=20] - Number of matches per page.
     * @param {string} [options.teamName] - Name of the team to filter matches.
     */
    async getSchedule({ beforeDate, afterDate, page, pageSize, teamName, gameId } = {}) {
        try {
            return await MatchRepository.findAll({ beforeDate, afterDate, page, pageSize, teamName, gameId });
        } catch (error) {
            throw new APIError('Error fetching schedule: ' + error.message);
        }
    }
}

module.exports = new MatchService();
