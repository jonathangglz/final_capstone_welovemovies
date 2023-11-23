const path = require("path");

require("dotenv").config();

const {
  NODE_ENV = "development",
  DATABASE_URL = "postgresql://postgres@localhost/postgres",
  DEVELOPMENT_DATABASE_URL,
  PRODUCTION_DATABASE_URL,
} = process.env;

let connectionURL;

switch (NODE_ENV) {
  case "production":
    connectionURL = PRODUCTION_DATABASE_URL || DATABASE_URL;
    break;
  case "test":
    // Test configuration (using SQLite3 or another setup as you prefer)
    connectionURL = { filename: ":memory:" };
    break;
  default:
    // Default to development if NODE_ENV is not set
    connectionURL = DEVELOPMENT_DATABASE_URL || DATABASE_URL;
}

module.exports = {
  development: {
    client: "postgresql",
    connection: connectionURL,
    pool: { min: 0, max: 5 },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
  },

  production: {
    client: "postgresql",
    connection: connectionURL,
    pool: { min: 0, max: 5 },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
  },

  test: {
    client: "sqlite3",
    connection: connectionURL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    useNullAsDefault: true,
  },
};
