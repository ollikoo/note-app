import redis from "redis";
import dotenv from "dotenv";
dotenv.config();

// Connect to the database
const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

client.connect();

client.on("connect", () => {
  console.log("Redis connected");
});

client.on("error", (err: any) => {
  console.log("Redis error:", err);
});

export default client;
