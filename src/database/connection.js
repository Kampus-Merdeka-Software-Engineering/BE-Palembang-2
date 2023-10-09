// MySql Database Connection
const mysql = require("mysql2");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "containers-us-west-42.railway.app",
  user: "root",
  password: "HAbS7esB7UE8HnIY3opq",
  database: "railway",
  port: 6578,
});

// pool.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

module.exports = pool;
