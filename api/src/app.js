const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./middlewares/error-handler.middleware');

const index = require('./routes/index');
const matchRouter = require("./routes/match.router");
const authRouter = require("./routes/auth.router");
const betRoutes = require('./routes/bet.router');

const app = express();

let corsOptions = {
    origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Public routes
app.use(index);

app.use("/api/auth", authRouter());
app.use("/api/schedule", matchRouter());
app.use('/api/bets', betRoutes());


app.use(errorHandler);

module.exports = app;
