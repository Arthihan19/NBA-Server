class IUserRepository {
    findById(id) {}
    findByEmail(email) {}
    createUser(userData) {}
    updateUser(userId, userData) {}
    deleteUser(userId) {}
}

module.exports = IUserRepository;
