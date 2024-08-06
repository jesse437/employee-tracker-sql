// resetDatabase.js
const { Client } = require("pg");
require("dotenv").config();

async function resetDatabase() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: 5432,
  });

  try {
    await client.connect();

    // Drop and create the database without using a transaction block
    await client.query("DROP DATABASE IF EXISTS employees_db");
    await client.query("CREATE DATABASE employees_db");

    console.log("Database reset successfully.");
  } catch (err) {
    console.error("Error resetting database:", err);
  } finally {
    await client.end();
  }
}

resetDatabase();
