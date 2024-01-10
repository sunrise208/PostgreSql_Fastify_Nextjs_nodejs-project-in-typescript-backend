import { FastifyPluginCallback } from "fastify";
import { parse as defaultParser } from "fast-querystring";

interface FastifyFormbodyOptions {
  parser: (body: Buffer) => any;
  bodyLimit?: number;
}

const fastifyFormbody: FastifyPluginCallback<FastifyFormbodyOptions> = function (
  fastify,
  options,
  next
) {
  const opts = Object.assign({ parser: defaultParser }, options);
  if (typeof opts.parser !== "function") {
    next(new Error("parser must be a function"));
    return;
  }

  function contentParser(req: any, body: Buffer, done: (err: Error | null, body: any) => void) {
    done(null, opts.parser(body));
  }

  fastify.addContentTypeParser(
    "application/x-www-form-urlencoded",
    { parseAs: "buffer", bodyLimit: opts.bodyLimit },
    contentParser
  );
  next();
};

export default fastifyFormbody;