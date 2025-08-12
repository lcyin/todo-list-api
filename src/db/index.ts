import { Pool } from "pg";
import { config } from "../config";

const dbConfig = {
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  ssl: config.database.ssl,
  max: config.database.maxConnections,
};

export const db = new Pool(dbConfig);
