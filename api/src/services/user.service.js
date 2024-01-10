const UserRepository = require('../repositories/user.repository');
const IUserService = require('../interfaces/IUserService');

class UserService extends IUserService {
    constructor(userRepository) {
        super();
        this.userRepository = userRepository;
    }

    async createUser(userData) {
        return await this.userRepository.createUser(userData);
    }

    async findByUsername(username) {
        return await this.userRepository.findByUsername(username);
    }
}

module.exports = UserService;