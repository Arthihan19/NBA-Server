const bcrypt = require('bcryptjs');
const { generateToken } = require('../middlewares/auth.middleware');

class AuthController {
    constructor(userService) {
        this.userService = userService;
    }

    asyncWrapper(fn) {
        return (req, res, next) => {
            fn(req, res, next).catch(next);
        };
    }

    signUp = this.asyncWrapper(async (req, res) => {
        // Hash the password
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);

        const user = await this.userService.createUser({
            username: req.body.username,
            password: hashedPassword
        });

        res.status(201).send({ message: "User registered successfully!" });
    });

    signIn = this.asyncWrapper(async (req, res) => {
        const token = await generateToken(req.body.username, req.body.password);
        const user = await this.userService.findByUsername(req.body.username);

        res.status(200).send({
            id: user.id,
            username: user.username,
            accessToken: token
        });
    });
}

module.exports = AuthController;