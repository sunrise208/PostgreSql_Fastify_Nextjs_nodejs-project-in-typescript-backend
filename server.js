const Fastify = require("fastify");
const authRoute = require("./routes/auth");
const dbConnector = require("./dbconnect");

const fastify = Fastify({
  //   logger: true,
});

fastify.register(authRoute, { prefix: "/auth" });
fastify.register(dbConnector);

try {
  fastify.listen({ port: 5000 }, () =>
    console.log("fastify server is running on port 5000...")
  );
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
