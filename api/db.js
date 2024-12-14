import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const db = new pg.Client({
  connectionString: process.env.DATABASE_URI,
  ssl: {
    rejectUnauthorized: false, // Allows self-signed certificates (adjust this in production)
  },
});

export default db;
