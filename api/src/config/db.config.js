const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgres://wtgjuaaj:hEuPP5CHXnzVS1NOvz0LRPemT9ZAlHWS@rosie.db.elephantsql.com/wtgjuaaj',
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

pool.on('connect', () => {
    console.log('Connected to the database');
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
