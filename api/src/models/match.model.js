class Match {
    constructor({ id, teamOne, teamOneId, teamOneOdds, teamTwo, teamTwoId, teamTwoOdds, matchDate }) {
        this.id = id;
        this.teamOne = teamOne;
        this.teamOneId = teamOneId;
        this.teamOneOdds = teamOneOdds;
        this.teamTwo = teamTwo;
        this.teamTwoId = teamTwoId;
        this.teamTwoOdds = teamTwoOdds;
        this.matchDate = matchDate;
    }
}

module.exports = Match;
