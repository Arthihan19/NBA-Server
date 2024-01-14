const express = require('express');
const authRouter = express.Router();

module.exports = function(authControllerInstance) {
    authRouter.post('/signup', authControllerInstance.signUp)

    authRouter.post('/signin', authControllerInstance.signIn);

    authRouter.post('/refresh-token', authControllerInstance.refreshToken);

    return authRouter;
};
