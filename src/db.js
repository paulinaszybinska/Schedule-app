const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mr_coffee_auth',
    password: PGPASSWORD,
    port: 5432,
});

module.exports = pool;