CREATE TABLE Bets
(
    id            SERIAL PRIMARY KEY,
    game_id       VARCHAR(255) NOT NULL,
    user_id       INTEGER      NOT NULL,
    team_id       VARCHAR(255) NOT NULL,
    odds_bet_with VARCHAR(255) NOT NULL,
    currency_bet  VARCHAR(255) NOT NULL,
    state         VARCHAR(255) CHECK (state = 'PENDING' OR state = 'WON' OR state = 'LOST'),
    created       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (userId)
);
