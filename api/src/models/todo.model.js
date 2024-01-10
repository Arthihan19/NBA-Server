class Todo {
    constructor({ todoId, todoName, todoDescription, todoComplete, todoCreated, todoUpdated }) {
        this.todoId = todoId;
        this.todoName = todoName;
        this.todoDescription = todoDescription;
        this.todoComplete = todoComplete;
        this.todoCreated = todoCreated;
        this.todoUpdated = todoUpdated;
    }
}

module.exports = Todo;
