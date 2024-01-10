CREATE TABLE todos (
                          todoId SERIAL PRIMARY KEY,
                          todoName VARCHAR(255) NOT NULL,
                          todoDescription VARCHAR(255) NOT NULL,
                          todoComplete BOOLEAN NOT NULL DEFAULT false,
                          todoCreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          todoUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);