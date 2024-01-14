const Match = require("../models/match.model");
const axios = require('axios');

/**
 * @typedef {Object} MatchRow
 * @property {number} id
 * @property {string} teamOne
 * @property {string} teamTwo
 * @property {Date} matchDate
 */

/**
 * Maps a row from the json response to a Match object.
 *
 * @param {MatchRow} row
 * @param {Object} odds
 */
const mapRowToMatch = (row, odds = {teamOneOdds: null, teamTwoOdds: null}) => {
    return new Match({
        id: row.gameId,
        teamOne: row.homeTeam.teamName,
        teamOneOdds: odds.teamOneOdds,
        teamTwo: row.awayTeam.teamName,
        teamTwoOdds: odds.teamTwoOdds,
        matchDate: row.gameDateUTC,
    });
};

class MatchRepository {
    async fetchOdds() {
        try {
            const response = await axios.get('https://cdn.nba.com/static/json/liveData/odds/odds_todaysGames.json');
            return response.data.games.reduce((acc, game) => {
                const odds = game.markets[0]?.books[0]?.outcomes;
                const teamOneOdds = odds?.find(outcome => outcome.type === 'home')?.odds;
                const teamTwoOdds = odds?.find(outcome => outcome.type === 'away')?.odds;
                acc[game.gameId] = { teamOneOdds, teamTwoOdds };
                return acc;
            }, {});
        } catch (error) {
            throw new Error('Error fetching odds: ' + error.message);
        }
    }

    async fetchAllMatches() {
        try {
            const response = await axios.get('https://cdn.nba.com/static/json/staticData/scheduleLeagueV2_1.json');
            return response.data.leagueSchedule.gameDates.flatMap(date => date.games);
        } catch (error) {
            throw new Error('Error fetching matches: ' + error.message);
        }
    }

    async findAll({ beforeDate, afterDate, page = 0, pageSize = 100, teamName, gameId } = {}) {
        const matches = await this.fetchAllMatches();
        const odds = await this.fetchOdds();

        return matches
            .filter(match => !gameId || match.gameId === gameId)
            .filter(match => !beforeDate || new Date(match.gameDateUTC) < beforeDate)
            .filter(match => !afterDate || new Date(match.gameDateUTC) > afterDate)
            .filter(match => !teamName || match.homeTeam.teamName === teamName || match.awayTeam.teamName === teamName)
            .slice(page * pageSize, (page + 1) * pageSize)
            .map(match => mapRowToMatch(match, odds[match.gameId]));
    }
}

module.exports = new MatchRepository();
