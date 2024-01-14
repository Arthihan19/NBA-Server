CREATE TABLE Bet
(
    id            SERIAL PRIMARY KEY,
    match_id      INTEGER          NOT NULL,
    user_id       INTEGER          NOT NULL,
    team_bet_on   VARCHAR(255) CHECK (team_bet_on = 'teamOne' OR team_bet_on = 'teamTwo'),
    odds_bet_with DOUBLE PRECISION NOT NULL,
    currency_bet  DOUBLE PRECISION NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (userId)
);
