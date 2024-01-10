const UserRepository = require('../repositories/user.repository');
const userRepository = new UserRepository();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'my-secret-key';

async function authToken(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).send('Missing Authorization Token');
    }

    try {
        const decodedToken = jwt.verify(token, SECRET_KEY);

        console.log(decodedToken)

        // attach user object to request for further usage
        req.user = { id: decodedToken.id, username: decodedToken.username };
        next();
    } catch (error) {
        return res.status(401).send('Invalid Token');
    }
}

async function generateToken(username, password) {
    const user = await userRepository.findByUsername(username);

    // Check if user exists and if the password matches
    if (!user || !await bcrypt.compare(password, user.password)) {
        throw new Error('Invalid Authentication Credentials');
    }

    const tokenPayload = {
        id: user.userId,
        username: user.username
    };

    return jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '1h' }); // token expires in 1 hour
}

module.exports = {
    authToken,
    generateToken
};
