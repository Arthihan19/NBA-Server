const APIError = require('../errors/api.error');

class TodoCreateDTO {
    constructor(data) {
        this.todoName = data.todoName;
        this.todoDescription = data.todoDescription;
        this.todoComplete = data.todoComplete;
    }

    static fromRequest(requestData) {
        const dto = new TodoCreateDTO(requestData);
        dto.validate();
        return dto;
    }

    validate() {
        if (!this.todoName || typeof this.todoName !== 'string') {
            throw new APIError(400, 'Invalid or missing todo name');
        }

        if (this.todoName.length > 100) {
            throw new APIError(400, 'Todo name is too long, maximum length is 100 characters');
        }

        if (!this.todoDescription || typeof this.todoDescription !== 'string') {
            throw new APIError(400, 'Invalid or missing todo description');
        }

        if (this.todoDescription.length > 500) {
            throw new APIError(400, 'Todo description is too long, maximum length is 500 characters');
        }

        if (!this.todoComplete && typeof this.todoComplete !== 'boolean') {
            throw new APIError(400, 'Invalid todo completed status');
        }
    }
}

module.exports = TodoCreateDTO;
