const { Client } = require("pg");
const fastifyPlugin = require("fastify-plugin");

async function dbConnector(fastify, options) {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "sunrise",
    password: "rlafuaud",
    port: 5432,
  });

  client.connect().then(() => console.log("PostgreSQL is connected..."));
}

module.exports = fastifyPlugin(dbConnector);
