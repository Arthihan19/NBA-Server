const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const scheduleBetProcessing = require('./bets.cron');
const errorHandler = require('./middlewares/error-handler.middleware');

const index = require('./routes/index');
const matchRouter = require("./routes/match.router");
const authRouter = require("./routes/auth.router");
const betRoutes = require('./routes/bet.router');
const {processBets} = require("./bets.cron");

const app = express();

let corsOptions = {
    origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

scheduleBetProcessing();

// Public routes
app.use(index);

app.use("/api/auth", authRouter());
app.use("/api/schedule", matchRouter());
app.use('/api/bets', betRoutes());


app.use(errorHandler);

module.exports = app;
