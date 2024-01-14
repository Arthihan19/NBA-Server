const UserRepository = require('../repositories/user.repository');

class UserService {
    constructor() {
        this.userRepository = UserRepository;
    }

    async createUser(userData) {
        return await this.userRepository.createUser(userData);
    }

    async findByUsername(username) {
        return await this.userRepository.findByUsername(username);
    }

    async saveRefreshToken(userId, refreshToken) {
        return await this.userRepository.saveRefreshToken(userId, refreshToken);
    }

    async findByRefreshToken(refreshToken) {
        const user = await this.userRepository.findByRefreshToken(refreshToken);

        if (!user) {
            throw new Error('Invalid refresh token');
        }

        return user;
    }

    async doesUsernameExist(username) {
        const user = await this.userRepository.findByUsername(username);
        return Boolean(user);
    }

    async getUserDetails(userId) {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        return {
            currency: user.currency,
            betsWon: user.betsWon,
            betsLost: user.betsLost
        };
    }

    async getLeaderboard(options) {
        return await this.userRepository.getLeaderboard(options);
    }

    async getUserPlacing(userId) {
        return await this.userRepository.getUserPlacing(userId);
    }
}

module.exports = new UserService();