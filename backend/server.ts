import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

const server = fastify();

server.register(cors);
server.register(jwt, { secret: process.env.JWT_SECRET || "supersecret" });

server.get("/", async (request, reply) => {
  return { status: "Backend is running!" };
});

const start = async () => {
  try {
    await server.listen({ port: 5000, host: "0.0.0.0" });
    console.log("Server listening on http://localhost:5000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
