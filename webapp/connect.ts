import { mysql } from "@/libs/backend";

export const pool = mysql
  .createPool({
    host: process.env.DB_HOST, // name of the docker-compose service
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5,
    maxIdle: 5,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  })
  .promise();

export function printEnv() {
  console.log(
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    process.env.DB_NAME,
    process.env.DB_PORT,
    process.env.WEBAPP_API_URL,
    process.env.WEBAPP_PORT,
  );
}
