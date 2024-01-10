class IUserService {
    getById(id) {}
    getByEmail(email) {}
    signUp(userData) {}
    signIn(email, password) {}
    updateUser(id, userData) {}
    deleteUser(id) {}
}

module.exports = IUserService;
