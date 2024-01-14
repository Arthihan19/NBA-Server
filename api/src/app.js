const express = require('express');
const cors = require('cors');
const index = require('./routes/index');
const errorHandler = require('./middlewares/error-handler.middleware');

const MatchRepository = require('./repositories/match.repository');
const MatchService = require('./services/match.service');
const MatchController = require('./controllers/match.controller');
const matchRouter = require("./routes/match.router");

const UserRepository = require('./repositories/user.repository');
const UserService = require('./services/user.service');
const AuthController = require('./controllers/auth.controller');
const authRouter = require("./routes/auth.router");

const app = express();

let corsOptions = {
    origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended: true}))

const matchRepositoryInstance = new MatchRepository();
const matchServiceInstance = new MatchService(matchRepositoryInstance);
const matchControllerInstance = new MatchController(matchServiceInstance);

const userRepositoryInstance = new UserRepository();
const userServiceInstance = new UserService(userRepositoryInstance);
const authControllerInstance = new AuthController(userServiceInstance);

// Public routes
app.use(index);

app.use("/api/auth", authRouter(authControllerInstance));


// app.use("/api", authToken, todoRouter(todoControllerInstance));
app.use("/api", matchRouter(matchControllerInstance));

app.use(errorHandler);

module.exports = app;
