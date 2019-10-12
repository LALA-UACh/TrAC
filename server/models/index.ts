import requireEnv from "require-env-variable";
import { Sequelize } from "sequelize";

const {
  POSTGRES_PASSWORD: password,
  POSTGRES: host,
  POSTGRES_AUTH_DB: authDatabase,
  POSTGRES_DATA_DB: dataDatabase,
} = requireEnv([
  "POSTGRES_PASSWORD",
  "POSTGRES",
  "POSTGRES_AUTH_DB",
  "POSTGRES_DATA_DB",
]);

const username = process.env.POSTGRES_USERNAME || "postgres";

export const sequelizeAuth = new Sequelize({
  database: authDatabase,
  host,
  password,
  dialect: "postgres",
  username,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
});

export const sequelizeLalauach = new Sequelize({
  database: dataDatabase,
  host,
  password,
  dialect: "postgres",
  username,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
});
