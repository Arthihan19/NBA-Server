const APIError = require('../errors/api.error');

const errorHandler = (err, req, res, next) => {
    if (err instanceof APIError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
};

module.exports = errorHandler;