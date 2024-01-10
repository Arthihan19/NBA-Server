const express = require('express');
const cors = require('cors');
const index = require('./routes/index');
const errorHandler = require('./middlewares/error-handler.middleware');

const { authToken } = require('./middlewares/auth.middleware');  // Adjusted import

const TodoRepository = require('./repositories/todo.repository');
const TodoService = require('./services/todo.service');
const TodoController = require('./controllers/todo.controller');
const todoRouter = require("./routes/todo.router");

const UserRepository = require('./repositories/user.repository');
const UserService = require('./services/user.service');
const AuthController = require('./controllers/auth.controller');

const app = express();

let corsOptions = {
    origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const todoRepositoryInstance = new TodoRepository();
const todoServiceInstance = new TodoService(todoRepositoryInstance);
const todoControllerInstance = new TodoController(todoServiceInstance);

const userRepositoryInstance = new UserRepository();
const userServiceInstance = new UserService(userRepositoryInstance);
const authControllerInstance = new AuthController(userServiceInstance);

// Public routes
app.use(index);
app.post('/signup', authControllerInstance.signUp);
app.post('/signin', authControllerInstance.signIn);

app.use("/api", authToken, todoRouter(todoControllerInstance));

app.use(errorHandler);

module.exports = app;
