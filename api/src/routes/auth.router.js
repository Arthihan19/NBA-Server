// auth.router.js

const express = require('express');
const authRouter = express.Router();

const AuthController = require('../controllers/auth.controller');
const {authToken} = require("../middlewares/auth.middleware");

module.exports = function() {
    authRouter.post('/signup', AuthController.signUp);
    authRouter.post('/signin', AuthController.signIn);
    authRouter.post('/refresh-token', AuthController.refreshToken);
    authRouter.get('/me', authToken, AuthController.getMe);

    return authRouter;
};
