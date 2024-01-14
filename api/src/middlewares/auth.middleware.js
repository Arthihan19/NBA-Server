const UserRepository = require('../repositories/user.repository');
const userRepository = new UserRepository();
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'my-secret-key';
const REFRESH_SECRET_KEY = 'my-refresh-secret-key';

async function authToken(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).send('Missing Authorization Token');
    }

    try {
        const decodedToken = jwt.verify(token, SECRET_KEY);

        req.user = { id: decodedToken.id, username: decodedToken.username };
        next();
    } catch (error) {
        return res.status(401).send('Invalid Token');
    }
}

function generateToken(user) {
    const accessToken = jwt.sign({ id: user.userId, username: user.username }, SECRET_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.userId, username: user.username }, REFRESH_SECRET_KEY, { expiresIn: '7d' });

    return { accessToken, refreshToken };
}

async function refreshAccessToken(refreshToken) {
    try {
        jwt.verify(refreshToken, REFRESH_SECRET_KEY);

        const user = await userRepository.findByRefreshToken(refreshToken);

        if (!user) {
            throw new Error('Invalid refresh token');
        }

        return jwt.sign({ id: user.userId, username: user.username }, SECRET_KEY, { expiresIn: '15m' });
    } catch (error) {
        throw new Error('Failed to refresh token: ' + error.message);
    }
}


module.exports = {
    authToken,
    generateToken,
    refreshAccessToken
};
