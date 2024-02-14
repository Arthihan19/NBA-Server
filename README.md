# NBA fake currency betting game

## Table of contents

1. [Description](#description)
2. [Tech stack](#tech-stack)
3. [API](#API)
4. [Model](#model)
5. [Features](#features)
6. [Usage](#usage)

## Description

## Note: this is the backend repository for the frontend code please visit https://github.com/Arthihan19/NBA-Client

This project offers an engaging NBA betting game, complete with a virtual currency system. Initially, users are provided with 1,000 coins upon registration. Following this, they receive a daily bonus of 2,000 coins. These coins can be used for wagering on forthcoming NBA games, typically those that are scheduled to take place within the next 48 hours and come with pre-set betting odds. The game periodically distributes rewards based on the outcomes of these matches. Wins and losses from these bets are accordingly updated in the user's account, reflecting their betting performance. A leaderboard system also exists to see how you stack up with other users.

An instance of this front-end React app is hosted on vercel here: https://nba-fake-bet.vercel.app
And the backend is hosted here: https://nba-backend-api.onrender.com/

## Tech-stack

* [Frontend tech stack](https://github.com/Arthihan19/NBA-Client)
* [NPM](https://www.npmjs.com/)
* [Node.js](https://nodejs.org/en)
* [Express](https://expressjs.com/)
* [Postgresql](https://www.postgresql.org/)
* [Docker](https://www.docker.com/) & [docker compose](https://docs.docker.com/compose/)
* [Node cron](https://www.npmjs.com/package/node-cron)

## API

### Authentication

This Authentication API provides a secure way to manage user authentication, including sign-up, sign-in, refreshing tokens, fetching user details, and logging out. It utilizes JWT (JSON Web Tokens) for maintaining user sessions and bcryptjs for password hashing to ensure security. Endpoints

#### POST `/signup`

Registers a new user.

* **Body Parameters:**
  
  * `username`: A string between 3 and 20 characters.
  * `password`: A string between 6 and 40 characters.

* **Success Response:** HTTP 201
  
  * **Content:** `{ message: "User registered successfully!", id: <userId>, username: <username>, currency: <currency>, betsWon: <betsWon>, betsLost: <betsLost> }`

* **Error Response:** HTTP 400
  
  * **Content:** `{ message: <error_message> }`

#### POST `/signin`

Authenticates a user and returns access and refresh tokens.

* **Body Parameters:**
  
  * `username`: Registered username.
  * `password`: User's password.

* **Success Response:** HTTP 200
  
  * **Content:** `{ id: <userId>, username: <username>, currency: <currency>, betsWon: <betsWon>, betsLost: <betsLost> }`
  * **Cookies:** `accessToken`, `refreshToken` set as httpOnly cookies.

* **Error Response:** HTTP 401
  
  * **Content:** `{ message: "Invalid Credentials" }`

#### POST `/refresh-token`

Refreshes the access token using a refresh token.

* **Cookies Required:**
  
  * `refreshToken`: Current refresh token from httpOnly cookie.

* **Success Response:** HTTP 200
  
  * **Content:** `{ accessToken: <newAccessToken> }`
  * **Cookies Updated:** `accessToken` is refreshed and set as an httpOnly cookie.

* **Error Response:** HTTP 401
  
  * **Content:** `{ message: "Invalid refresh token" }`

#### GET `/me`

Fetches details of the currently authenticated user.

* **Headers Required:**
  
  * `Authorization`: Bearer token (access token).

* **Success Response:** HTTP 200
  
  * **Content:** User details.

* **Error Response:** HTTP 401/403 for unauthorized or expired tokens.

#### POST `/logout`

Logs out the current user and clears the session.

* **Headers Required:**
  
  * `Authorization`: Bearer token (access token).

* **Success Response:** HTTP 200
  
  * **Content:** `{ message: "Logged out successfully" }`
  * **Cookies Cleared:** `accessToken`, `refreshToken`

### Security

* Passwords are hashed using `bcryptjs` for secure storage.
* JWTs are used for session management, ensuring secure and stateless authentication.
* Cookies are set as httpOnly and secure, protecting them from XSS attacks and ensuring they are sent over HTTPS.
  
  

### Betting

This Betting API facilitates managing user bets, including placing bets, retrieving user bets, and accessing the leaderboard. It is designed to work with a secure authentication mechanism to ensure that user actions are authenticated.

#### POST `/bets/place`

Places bets for the authenticated user.

* **Headers Required:**
  
  * `Authorization`: Bearer token (access token).

* **Body Parameters:**
  
  * `betsArray`: Array of bet objects containing bet details.

* **Success Response:** HTTP 201
  
  * **Content:** Array of placed bet objects including bet details.

* **Error Response:** HTTP 500
  
  * **Content:** `{ message: <error_message> }`

#### GET `/bets/user`

Retrieves bets placed by the authenticated user, with optional filtering.

* **Headers Required:**
  
  * `Authorization`: Bearer token (access token).

* **Query Parameters:**
  
  * `state`: Filter by bet state (optional).
  * `page`: Pagination page index (default: 0).
  * `pageSize`: Number of items per page (default: 20, max: 100).
  * `beforeDate`: Filter bets placed before a specific date (optional).
  * `afterDate`: Filter bets placed after a specific date (optional).

* **Success Response:** HTTP 200
  
  * **Content:** Array of bet objects matching the query criteria.

* **Error Response:** HTTP 500
  
  * **Content:** `{ message: <error_message> }`

#### GET `/bets/leaderboard`

Retrieves the leaderboard, showing top users by winnings, and the authenticated user's placing and stats.

* **Headers Required:**
  
  * `Authorization`: Bearer token (access token).

* **Query Parameters:**
  
  * `page`: Pagination page index (optional).
  * `pageSize`: Number of items per page (optional, with server-defined defaults and maximums).

* **Success Response:** HTTP 200
  
  * **Content:**
  
  * ```
    {
        "leaderboard": Array of user leaderboard entries, 
        "userStats": The requesting user's stats if they appear on the leaderboard, 
        "userPlacing": The requesting user's placing on the leaderboard 
    }
    ```

* **Error Response:** HTTP 500
  
  * **Content:** `{ message: 'Error fetching leaderboard: ' + <error_message> }`

### Security

The API requires JWT-based authentication for each endpoint, ensuring that only authenticated users can perform actions related to betting.



### Match

The Match API provides access to match schedules, allowing users to fetch information about upcoming or past matches with various filtering options. This API is secured with JWT-based authentication to ensure that only authorized users can access the match schedule data.

#### GET `/matches`

Fetches the match schedule with optional filters.

* **Headers Required:**
  
  * `Authorization`: Bearer token (access token).

* **Query Parameters:**
  
  * `beforeDate`: Fetch matches scheduled before this date. Format: `YYYY-MM-DD`.
  * `afterDate`: Fetch matches scheduled after this date. Format: `YYYY-MM-DD`.
  * `page`: Pagination page index (optional, defaults vary by implementation).
  * `pageSize`: Number of matches per page (optional, with reasonable defaults and maximums).
  * `teamName`: Filter matches by the participating team's name.
  * `gameId`: Filter matches by game ID.

* **Success Response:** HTTP 200
  
  * **Content:** An array of match objects each containing details about the match such as date, teams, and game ID.

* **Error Response:** HTTP 500
  
  * **Content:** `{ message: 'Error fetching schedule: ' + <error_message> }`

### Security

Access to the match schedule endpoint is secured with JWT authentication. Clients must include a valid JWT in the `Authorization` header of their requests.



## Model

#### Bets

```plsql
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

```



#### User

```plsql
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

```





## Features

* User sign up and registration
* Real NBA schedule displaying information about past and future matches and their real betting odds
* Users are given fake currency on sign up and on a daily
* Users can bet their currency on NBA matches with odds
* Twice a day NBA schedule is scanned for completed games resulting in reward distribution and a bet status update for each participating user
* Users can view all their bets and their status
* Users can also see how they stack up against everyone else on a leaderboard

## Usage

* `git clone https://github.com/Arthihan19/NBA-Server`
* `cd api`
* `docker compose up -d`
* `./scripts/prepare.sh && ./scripts/run_sql`
* `npm run start`
* Make sure to also follow the frontend setup (https://github.com/Arthihan19/NBA-Client)
