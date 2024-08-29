// server/db.js
import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();




const config = {
  user: "sa",    // Your database username
  password:"1",   // Your database password
  server: "DEVIL\\SQLEXPRESS",       // Your database server address
  database:"urbanpostask",       // Your database name
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
