import { type Knex, knex as setupKnex } from "knex";
import appEnvs from "./env";

// Update with your config settings.
export const config: { [key: string]: Knex.Config } = {
  test: {
    client: "mysql",
    connection: {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "",
      database: "test_test_integracao",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },

  production: {
    client: "mysql",
    connection: {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "",
      database: "test_integracao",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },
};

const env = process.env.NODE_ENV === "production" ? "production" : "test";

export default config;
export const knexClient = setupKnex(config[env]);
