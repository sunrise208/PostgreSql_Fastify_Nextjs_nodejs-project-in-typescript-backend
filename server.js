const { Client, Pool } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'sunrise',
    password: 'rlafuaud',
    port: 5432,
})

client.connect().then(() => console.log("PostgreSQL is connected..."))