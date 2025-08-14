import { Pool } from "pg";
import { config } from "../config";

let dbConfig;
if (process.env.NODE_ENV === "test") {
  dbConfig = {
    host: "localhost",
    port: 25434,
    database: "todolist_test",
    user: "postgres",
    password: "password",
    ssl: false,
    max: 10,
  };
} else {
  dbConfig = {
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
    ssl: config.database.ssl,
    max: config.database.maxConnections,
  };
}

export const db = new Pool(dbConfig);
