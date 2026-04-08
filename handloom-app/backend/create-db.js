const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

const createDatabase = async () => {
  try {
    console.log("Connecting to MySQL server...");
    
    // Connect without specifying a database to create it
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
    });

    const dbName = process.env.DB_NAME || "aureloom";
    
    console.log(`Executing CREATE DATABASE IF NOT EXISTS \`${dbName}\`...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    
    console.log(`✅ Database '${dbName}' created successfully!`);
    await connection.end();
  } catch (error) {
    console.error("❌ Failed to create database. Is your MySQL server running? Error:", error.message);
  }
};

createDatabase();
