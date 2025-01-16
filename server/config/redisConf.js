import Redis from "ioredis";

const redisConfig = {
  password: "qpBIIvONFTEx5Xb3aAVIsmHJSD0bFhdD",
  host: "redis-13978.c273.us-east-1-2.ec2.redns.redis-cloud.com",
  port: 13978,
};

const redisClient = new Redis(redisConfig);

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis cloud cluster successfully!");
});

export default redisClient;
