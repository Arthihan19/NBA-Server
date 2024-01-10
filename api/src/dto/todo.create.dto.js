const APIError = require('../errors/api.error');

class TodoCreateDTO {
    constructor(data, userId) {
        this.todoName = data.todoName;
        this.todoDescription = data.todoDescription;
    }

    static fromRequest(requestData, userId) {
        const dto = new TodoCreateDTO(requestData, userId);
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
    }
}

module.exports = TodoCreateDTO;
