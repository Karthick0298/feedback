require("dotenv").config();
const { Pool } = require("pg");

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};

const pool = new Pool(dbConfig);

const testDatabaseConnection = async () => {
  const client = await pool.connect();

  try {
    console.log("Connected to the database successfully!");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

const queryDatabase = async (queryText, values) => {
  try {
    const client = await pool.connect();
    const result = await client.query(queryText, values);
    client.release();
    return result.rows;
  } catch (error) {
    console.log("error query");
    throw error;
  }
};

module.exports = {
  testDatabaseConnection,
  queryDatabase,
};
