const UserRepository = require('../repositories/user.repository');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
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
        return await this.userRepository.findByRefreshToken(refreshToken);
    }

    async doesUsernameExist(username) {
        const user = await this.userRepository.findByUsername(username);
        return Boolean(user);
    }
}

module.exports = new UserService();