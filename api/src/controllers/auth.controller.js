const bcrypt = require('bcryptjs');

const UserService = require('../services/user.service');
const {generateToken, refreshAccessToken} = require('../middlewares/auth.middleware');

class AuthController {
    asyncWrapper(fn) {
        return (req, res, next) => {
            fn(req, res, next).catch(next);
        };
    }

    signUp = this.asyncWrapper(async (req, res) => {
        const {username, password} = req.body;

        if (username.length < 3 || username.length > 20) {
            return res.status(400).send({message: "Username must be between 3 and 20 characters"});
        }

        if (password.length < 6 || password.length > 40) {
            return res.status(400).send({message: "Password must be between 6 and 40 characters"});
        }

        const usernameExists = await UserService.doesUsernameExist(username);
        if (usernameExists) {
            return res.status(400).send({message: "Username is already taken"});
        }

        const user = await UserService.createUser({username, password});

        const {accessToken, refreshToken} = generateToken(user);

        await UserService.saveRefreshToken(user.userId, refreshToken);

        res.cookie('accessToken', accessToken, {httpOnly: true, sameSite: 'strict'});
        res.cookie('refreshToken', refreshToken, {httpOnly: true, sameSite: 'strict'});

        res.status(201).send({
            message: "User registered successfully!",
            id: user.userId,
            username: user.username,
            currency: user.currency,
            betsWon: user.betsWon,
            betsLost: user.betsLost
        });
    });

    signIn = this.asyncWrapper(async (req, res) => {
        const user = await UserService.findByUsername(req.body.username);
        if (!user) {
            return res.status(401).send({message: "Invalid Credentials"});
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, user.salt);
        if (hashedPassword !== user.password) {
            return res.status(401).send({message: "Invalid Credentials"});
        }

        const {accessToken, refreshToken} = generateToken(user);

        await UserService.saveRefreshToken(user.userId, refreshToken);

        res.cookie('accessToken', accessToken, {httpOnly: true, sameSite: 'strict'});
        res.cookie('refreshToken', refreshToken, {httpOnly: true, sameSite: 'strict'});

        res.status(200).send({
            id: user.userId,
            username: user.username,
            currency: user.currency,
            betsWon: user.betsWon,
            betsLost: user.betsLost
        });
    });

    refreshToken = this.asyncWrapper(async (req, res) => {
        try {
            const refreshToken = req.cookies['refreshToken'];
            const newAccessToken = await refreshAccessToken(refreshToken);

            res.cookie('accessToken', newAccessToken, {httpOnly: true, sameSite: 'strict'});
            res.status(200).send({accessToken: newAccessToken});

        } catch (error) {
            res.status(401).send({message: 'Invalid refresh token'});
        }
    });

    getMe = this.asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const userDetails = await UserService.getUserDetails(userId);
        res.status(200).json(userDetails);
    });

    logout = this.asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        await UserService.saveRefreshToken(userId, null);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).send({message: 'Logged out successfully'});
    });
}

module.exports = new AuthController();