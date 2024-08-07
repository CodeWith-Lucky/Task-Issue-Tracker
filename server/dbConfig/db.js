// server/db.js
import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();


// Configuration for your SQL Server
const config = {
  user: process.env.DB_USER    ,    // Your database username
  password:process.env.DB_PASSWORD,   // Your database password
  server: process.env.DB_SERVER,       // Your database server address
  database: process.env.DB_DATABASE,       // Your database name
  options: {
    encrypt: false,  // Use encryption for secure connections
    trustServerCertificate: true, // Use this for local development (not recommended for production)
  },
};

// Create a pool connection
const poolPromise = sql.connect(config)
  .then(pool => {
    console.log('Connected to MSSQL');
    return pool;
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

export { sql, poolPromise };
