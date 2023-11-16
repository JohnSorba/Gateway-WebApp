// import { Pool } from "pg";
const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  user: process.env.DATABASE_USERNAME,
  port: process.env.DATABASE_PORT,
});

// export default pool;
module.exports = pool;
