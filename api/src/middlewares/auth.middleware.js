const UserService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'my-secret-key';
const REFRESH_SECRET_KEY = 'my-refresh-secret-key';

async function authToken(req, res, next) {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    if (!accessToken && !refreshToken) {
        return res.status(401).send('Missing Authorization Token');
    }

    try {
        if (accessToken) {
            const decodedToken = jwt.verify(accessToken, SECRET_KEY);
            req.user = { id: decodedToken.id, username: decodedToken.username };
            return next();
        }
    } catch (error) {
        console.log('Access token invalid, trying to refresh:', error.message);
    }

    if (refreshToken) {
        try {
            const newAccessToken = await refreshAccessToken(refreshToken);

            res.cookie('accessToken', newAccessToken, { httpOnly: true, sameSite: 'strict' });
            const decodedToken = jwt.verify(newAccessToken, SECRET_KEY);
            req.user = { id: decodedToken.id, username: decodedToken.username };
            return next();
        } catch (refreshError) {
            console.log('Failed to refresh token:', refreshError.message);
            return res.status(401).send('Invalid Refresh Token');
        }
    } else {
        return res.status(401).send('Refresh Token Not Provided');
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

        const user = await UserService.findByRefreshToken(refreshToken);
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
