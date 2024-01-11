const Fastify = require("fastify");

const { Client } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const fastifyCors = require("@fastify/cors");
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
fastify.register(fastifyCors, { origin: "*" });

fastify.post("/auth/register", (req: any, reply: any) => {
  client.query(
    "select email from users.users where email=$1",
    [req.body.email],
    function onResult(err: any, result: any) {
      if (!result.rows.length) {
        bcrypt.genSalt(10, function (err: any, salt: String) {
          bcrypt.hash(
            req.body.password,
            salt,
            function (err: any, hash: String) {
              client.query(
                "INSERT INTO users.users (name, email, password) VALUES($1, $2, $3) RETURNING '*'",
                [req.body.name, req.body.email, hash],
                function onResult(err: any, result: any) {
                  return reply.code(200).send({
                    success: true,
                    result,
                  });
                }
              );
            }
          );
        });
      } else {
        return reply.send({ success: false, msg: "email already exists..." });
      }
    }
  );
});

fastify.post("/auth/login", (req: any, reply: any) => {
  client.query(
    "select * from users.users where email=$1",
    [req.body.email],
    function onResult(err: any, result: any) {
      if (result.rows.length) {
        bcrypt.compare(
          req.body.password,
          result.rows[0].password,
          function (err: any, res: any) {
            if (res) {
              const loginUser = {
                name: result.rows[0].name,
                email: result.rows[0].email,
              };
              jwt.sign(
                loginUser,
                "sunrise96208@gmail.com",
                { expiresIn: 60 * 60 },
                function (err: any, token: String) {
                  return reply.send({ success: true, token });
                }
              );
            } else {
              return reply.send({
                success: false,
                msg: "password incorrect.",
              });
            }
          }
        );
      } else {
        return reply.send({ success: false, msg: "email doesn't exists." });
      }
    }
  );
});

try {
  fastify.listen({ port: 5000 }, () =>
    console.log("fastify server is running on port 5000...")
  );
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
