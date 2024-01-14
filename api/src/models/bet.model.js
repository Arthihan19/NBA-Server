class Bet {
    constructor({ id, game_id, user_id, team_id, odds_bet_with, currency_bet, state, created }) {
        this.id = id;
        this.game_id = game_id;
        this.user_id = user_id;
        this.team_id = team_id;
        this.odds_bet_with = odds_bet_with;
        this.currency_bet = currency_bet;
        this.state = state;
        this.created = created;
    }
}

module.exports = Bet;
