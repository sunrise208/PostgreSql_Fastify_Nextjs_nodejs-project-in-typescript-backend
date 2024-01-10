const Fastify = require("fastify");
const { Client } = require("pg");
const bcrypt = require("bcryptjs");

const fastifyFormbody = require("./fastifyFormBody");

const fastify = Fastify({});

fastify.register(fastifyFormbody);

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "sunrise",
  password: "rlafuaud",
  port: 5432,
});
client.connect().then(() => console.log("postgreSql is connected..."));

fastify.post("/auth/register", async function (req, reply) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      client.query(
        "INSERT INTO users.users (name, email, password) VALUES($1, $2, $3) RETURNING '*'",
        [req.body.name, req.body.email, hash],
        function onResult(err, result) {
          reply.send(err || result);
        }
      );
    });
  });
});

try {
  fastify.listen({ port: 5000 }, () =>
    console.log("fastify server is running on port 5000...")
  );
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
