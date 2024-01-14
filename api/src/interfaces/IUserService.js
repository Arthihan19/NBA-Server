class IUserService {
    createUser(userData) {}

    findByUsername(username) {}

    saveRefreshToken(userId, refreshToken) {}

    findByRefreshToken(refreshToken) {}
}

module.exports = IUserService;
