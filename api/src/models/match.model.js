class Match {
    constructor({ id, teamOne, teamOneOdds, teamTwo, teamTwoOdds, matchDate }) {
        this.id = id;
        this.teamOne = teamOne;
        this.teamOneOdds = teamOneOdds;
        this.teamTwo = teamTwo;
        this.teamTwoOdds = teamTwoOdds;
        this.matchDate = matchDate;
    }
}

module.exports = Match;
