CREATE TABLE users
(
    userId        SERIAL PRIMARY KEY,
    username      VARCHAR(255) UNIQUE NOT NULL,
    password      VARCHAR(255)        NOT NULL,
    salt          VARCHAR(255)        NOT NULL,
    currency      VARCHAR(255)             DEFAULT '0',
    bets_won      INTEGER                  DEFAULT 0,
    bets_lost     INTEGER                  DEFAULT 0,
    created       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    refresh_token VARCHAR(255)
);
