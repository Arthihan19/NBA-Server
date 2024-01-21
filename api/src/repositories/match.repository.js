const Match = require("../models/match.model");
const axios = require('axios');

const mapRowToMatch = (row, odds = {teamOneOdds: null, teamTwoOdds: null}) => {
    return new Match({
        id: row.gameId,
        teamOne: row.homeTeam.teamCity + " " + row.homeTeam.teamName,
        teamOneId: row.homeTeam.teamId,
        teamOneOdds: odds.teamOneOdds ? odds.teamOneOdds : null,
        teamTwo: row.awayTeam.teamCity + " " + row.awayTeam.teamName,
        teamTwoId: row.awayTeam.teamId,
        teamTwoOdds: odds.teamTwoOdds ? odds.teamTwoOdds : null,
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
                acc[game.gameId] = {teamOneOdds, teamTwoOdds};
                return acc;
            }, {});
        } catch (error) {
            throw new Error('Error fetching odds: ' + error.message);
        }
    }

    async fetchAllMatches() {
        try {
            const response = await axios.get('https://cdn.nba.com/static/json/staticData/scheduleLeagueV2_9.json');
            return response.data.leagueSchedule.gameDates.flatMap(date => date.games);
        } catch (error) {
            throw new Error('Error fetching matches: ' + error.message);
        }
    }

    async findAll({beforeDate, afterDate, page = 0, pageSize = 100, teamName, gameId} = {}) {
        const matches = await this.fetchAllMatches();
        const odds = await this.fetchOdds();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const twoWeeksFromNow = new Date(today);
        twoWeeksFromNow.setDate(today.getDate() + 14);

        if (!beforeDate) {
            beforeDate = twoWeeksFromNow.toISOString();
        }

        if (!afterDate) {
            afterDate = today.toISOString();
        }

        const validatedBeforeDate = new Date(beforeDate);
        if (validatedBeforeDate < today || validatedBeforeDate > twoWeeksFromNow) {
            beforeDate = twoWeeksFromNow.toISOString();
        }

        const validatedAfterDate = new Date(afterDate);
        if (validatedAfterDate < today || validatedAfterDate > twoWeeksFromNow) {
            afterDate = today.toISOString();
        }

        return matches
            .filter(match => !gameId || match.gameId === gameId)
            .filter(match => !beforeDate || new Date(match.gameDateUTC) <= new Date(beforeDate))
            .filter(match => !afterDate || new Date(match.gameDateUTC) >= new Date(afterDate))
            .filter(match => !teamName || teamName.includes(match.homeTeam.teamName) || teamName.includes(match.awayTeam.teamName))
            .slice(page * pageSize, (page + 1) * pageSize)
            .map(match => mapRowToMatch(match, odds[match.gameId]));
    }

    async findById(id) {
        const matches = await this.fetchAllMatches();
        const odds = await this.fetchOdds();

        return matches
            .filter(match => match.gameId === id)
            .map(match => mapRowToMatch(match, odds[match.gameId]))[0];
    }
}

module.exports = new MatchRepository();
